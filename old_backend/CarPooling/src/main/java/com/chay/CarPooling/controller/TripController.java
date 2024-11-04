package com.chay.CarPooling.controller;

import com.chay.CarPooling.model.Trip;
import com.chay.CarPooling.model.User;
import com.chay.CarPooling.service.TripService;
import com.chay.CarPooling.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    // todo
// user to provide all fields to be able to search except the passengers count ?
    @GetMapping("/search")
    public ResponseEntity<List<Trip>> searchTrips(
            @RequestParam(name = "goingTo", required = false) String goingTo,
            @RequestParam(name = "leavingFrom", required = false) String leavingFrom,
            @RequestParam(name = "date", required = false) LocalDate date,
            @RequestParam(name = "availableSeat", required = false) Integer availableSeat
            )
    {
        List<Trip> trips = tripService.searchTrips(goingTo, leavingFrom, date, availableSeat);
        return ResponseEntity.ok(trips);

    }

    @PutMapping("/{id}/join")
    public ResponseEntity<Trip> joinTrip(@PathVariable("id") Long tripId, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Trip joinedTrip = tripService.joinTrip(tripId, user);
        return ResponseEntity.ok(joinedTrip);
    }

    @GetMapping("/search-places")
    public JsonNode searchPlaces(@RequestParam String query) throws Exception {
        String res = tripService.searchPlaces(query);
        JsonNode jsonNode = objectMapper.readTree(res);
        return jsonNode;
    }

}


















