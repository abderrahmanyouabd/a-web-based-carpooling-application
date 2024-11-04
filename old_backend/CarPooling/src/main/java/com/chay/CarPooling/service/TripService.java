package com.chay.CarPooling.service;

import com.chay.CarPooling.model.Trip;
import com.chay.CarPooling.model.User;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
public interface TripService {

    Trip createTrip(Trip trip, User user);
    Trip getTripById(Long id) throws Exception;
    List<Trip> searchTrips(String goingTo, String leavingFrom, LocalDate date, Integer availableSeat);
    Trip joinTrip(Long tripId, User user) throws Exception;
    String searchPlaces(String query) throws Exception;
    List<Trip> findTripByPassenger(User user);
}
