package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.model.Trip;
import com.chay.CarPooling.model.User;
import com.chay.CarPooling.model.Vehicle;
import com.chay.CarPooling.repository.TripRepository;
import com.chay.CarPooling.service.FareCalculationService;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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


    @Override
    public Trip createTrip(Trip trip, User user) {
        // I should add logic for validation, authentication, etc ...
        trip.setDriver(user);

        Vehicle vehicle = user.getVehicle();
        if (vehicle == null) {
            throw new IllegalArgumentException("User does not have a registered vehicle.");
        }
        trip.setVehicle(vehicle);
        // need to save before setting fare since the api will need access to coordinates ??
//        tripRepository.save(trip);

        BigDecimal suggestedFare = fareCalculationService.calculateFare2(trip);
        trip.setFarePerSeat(suggestedFare);

        // retun the updated stuff
        return tripRepository.save(trip);

    }

    @Override
    public Trip getTripById(Long id) throws Exception {
        return tripRepository.findById(id).orElseThrow(() -> new Exception("Trip not found with id: " + id));
    }

    @Override
    public List<Trip> searchTrips(String goingTo, String leavingFrom, LocalDate date, Integer availableSeat) {
//        if (date == null) {
//            date = LocalDate.now();
//        }
        // Implement search logic based on depart, arrival and date
        // maybe query db with appropriate filters
        return tripRepository.searchTrips(goingTo, leavingFrom, date, availableSeat);
    }


    @Override
    public Trip joinTrip(Long tripId, User user) throws Exception {
        Trip trip = getTripById(tripId);
        if (trip.getAvailableSeats() > 0) {
            trip.setAvailableSeats(trip.getAvailableSeats() - 1);
            trip.getPassengers().add(user);
            // Additional logic for adding the user to the trip
            return tripRepository.save(trip);
        } else {
            throw new Exception("No available seats for this trip");
        }
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
}
