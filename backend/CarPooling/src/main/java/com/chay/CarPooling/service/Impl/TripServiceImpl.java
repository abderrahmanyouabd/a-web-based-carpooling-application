package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.model.Trip;
import com.chay.CarPooling.model.User;
import com.chay.CarPooling.model.Vehicle;
import com.chay.CarPooling.repository.TripRepository;
import com.chay.CarPooling.response.TripResponse;
import com.chay.CarPooling.service.FareCalculationService;
import com.chay.CarPooling.service.PaymentService;
import com.chay.CarPooling.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final FareCalculationService fareCalculationService;
    private final PaymentService paymentService;


    @Override
    public Trip createTrip(Trip trip, User user) {
        // I should add logic for validation, authentication, etc ...
        trip.setDriver(user);

        Vehicle vehicle = user.getVehicle();
        if (vehicle == null) {
            throw new IllegalArgumentException("User does not have a registered vehicle.");
        }
        trip.setVehicle(vehicle);
        trip.setStatus("PENDING");
        return tripRepository.save(trip);

    }

    @Override
    public Trip getTripById(Long id) throws Exception {
        return tripRepository.findById(id).orElseThrow(() -> new Exception("Trip not found with id: " + id));
    }

    @Override
    public List<Trip> searchTrips(String goingTo, String leavingFrom, String date, Integer availableSeats) {
        return tripRepository.searchTrips(goingTo, leavingFrom, date, availableSeats);
    }


    @Override
    public void joinTrip(Long tripId, User user) throws Exception {
        Trip trip = getTripById(tripId);

        // Check if there are available seats
        if (trip.getAvailableSeats() <= 0) {
            throw new Exception("No available seats for this trip");
        }

        // Update trip details: reduce available seats and add the user
        trip.setAvailableSeats(trip.getAvailableSeats() - 1);
        trip.getPassengers().add(user);

        // Save and return the updated trip
        tripRepository.save(trip);
    }


    // todo: get this shit working, it's not yet.
    @Override
    public String searchPlaces(String query) throws Exception {

        String openStreetMapApi="https://nominatim.openstreetmap.org/search?q="+query+"&format=json";

        RestTemplate restTemplate = new RestTemplate();

        try {
            HttpHeaders headers = new HttpHeaders();

            HttpEntity<String> entity = new HttpEntity<>(
                    "parameters",
                    headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    openStreetMapApi,
                    HttpMethod.GET, entity, String.class);

            return response.getBody();

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            System.err.println("Error: " + e);

            throw new Exception(e.getMessage());
        }
    }

    @Override
    public List<Trip> findTripByPassenger(User user) {
        return tripRepository.findByPassenger(user);
//        return List.of();
    }


    public List<TripResponse> getTripsUserJoined(Long userId) {
        List<Trip> joinedTrips = tripRepository.findByPassengers_Id(userId);
        return joinedTrips.stream().map(trip ->
                new TripResponse(
                        trip.getId(),
                        trip.getLeavingFrom(),
                        trip.getGoingTo(),
                        trip.getFarePerSeat(),
                        trip.getDriver(),
                        trip.getPassengers()
                )).toList();
    }

    public List<TripResponse> getTripsUserCreated(Long userId) {
        List<Trip> createdTrips = tripRepository.findByDriver_Id(userId);
        return createdTrips.stream().map(trip ->
                new TripResponse(
                        trip.getId(),
                        trip.getLeavingFrom(),
                        trip.getGoingTo(),
                        trip.getFarePerSeat(),
                        trip.getDriver(),
                        trip.getPassengers()
                )).toList();
    }
}
