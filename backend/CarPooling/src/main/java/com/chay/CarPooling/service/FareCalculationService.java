package com.chay.CarPooling.service;

import com.chay.CarPooling.model.Trip;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

public interface FareCalculationService {
    double calculateFare(Trip trip);
    double getDistanceFromAPI(String startLocation, String endLocation);
    double getDurationFromAPI(String startLocation, String endLocation);
    String getWeatherConditions(String latitude, String longitude);

}
