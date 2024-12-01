package com.chay.CarPooling.controller;

import com.chay.CarPooling.model.PaymentTransaction;
import com.chay.CarPooling.model.Trip;
import com.chay.CarPooling.model.User;
import com.chay.CarPooling.repository.PaymentTransactionRepository;
import com.chay.CarPooling.response.JoinTripResponse;
import com.chay.CarPooling.response.TripResponse;
import com.chay.CarPooling.service.PaymentService;
import com.chay.CarPooling.service.TripService;
import com.chay.CarPooling.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;
    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private final PaymentService paymentService;
    private final PaymentTransactionRepository paymentTransactionRepository;


    @PostMapping("/create")
    public ResponseEntity<Trip> createTrip(@RequestHeader("Authorization") String jwt, @RequestBody Trip trip) {
        User user = userService.findUserProfileByJwt(jwt);
        Trip createdTrip = tripService.createTrip(trip, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTrip);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable("id") Long id) throws Exception {
        Trip trip = tripService.getTripById(id);
        return ResponseEntity.ok(trip);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Trip>> searchTrips(
            @RequestParam(name = "goingTo", required = false) String goingTo,
            @RequestParam(name = "leavingFrom", required = false) String leavingFrom,
            @RequestParam(name = "date", required = false) String date,
            @RequestParam(name = "availableSeats", required = false) Integer availableSeats
            )
    {
        List<Trip> trips = tripService.searchTrips(goingTo, leavingFrom, date, availableSeats);
        return ResponseEntity.ok(trips);

    }


    @PutMapping("/{id}/join")
    public ResponseEntity<JoinTripResponse> joinTrip(@PathVariable("id") Long tripId, @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        Trip trip = tripService.getTripById(tripId);

        if (trip.getAvailableSeats() <= 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new JoinTripResponse(trip, null, "No available seats"));
        }


        PaymentTransaction transaction = null;
        try {
            transaction = paymentTransactionRepository.findByUserIdAndTripId(user.getId(), tripId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        if (transaction == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new JoinTripResponse(trip, null, "Payment not initiated"));
        }


        PaymentIntent paymentIntent = PaymentIntent.retrieve(transaction.getPaymentIntentId());

        if (!"succeeded".equals(paymentIntent.getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new JoinTripResponse(trip, null, "Payment failed"));
        }

        
        paymentService.updateTransactionStatus(paymentIntent.getId(), "SUCCESS");
        tripService.joinTrip(tripId, user);

        return ResponseEntity.ok(new JoinTripResponse(trip, paymentIntent.getClientSecret(), "Successfully joined the trip"));

    }




    @PostMapping("/{id}/pay")
    @Transactional
    public ResponseEntity<String> payForTrip(@PathVariable("id") Long tripId, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Trip trip = tripService.getTripById(tripId);

        if (trip.getPassengers().contains(user)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already joined the trip.");
        }

        PaymentTransaction existingTransaction = paymentTransactionRepository.findByUserIdAndTripId(user.getId(), tripId);
        if (existingTransaction != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Payment already initiated for this trip.");
        }

        BigDecimal fare = trip.getFarePerSeat();
        PaymentIntent paymentIntent = paymentService.createPaymentIntent(fare, "usd", user.getId(), tripId);

        return ResponseEntity.ok(paymentIntent.getClientSecret());
    }

    @GetMapping("/search-places")
    public JsonNode searchPlaces(@RequestParam String query) throws Exception {
        String res = tripService.searchPlaces(query);
        JsonNode jsonNode = objectMapper.readTree(res);
        return jsonNode;
    }

    @GetMapping("/joined")
    public ResponseEntity<List<TripResponse>> getTripsUserJoined(@RequestHeader("Authorization") String jwt) {
        User user = userService.findUserProfileByJwt(jwt);
        List<TripResponse> joinedTrips = tripService.getTripsUserJoined(user.getId());
        return ResponseEntity.ok(joinedTrips);
    }

    @GetMapping("/created")
    public ResponseEntity<List<TripResponse>> getTripsUserCreated(@RequestHeader("Authorization") String jwt) {
        User user = userService.findUserProfileByJwt(jwt);
        List<TripResponse> createdTrips = tripService.getTripsUserCreated(user.getId());
        return ResponseEntity.ok(createdTrips);
    }

}


















