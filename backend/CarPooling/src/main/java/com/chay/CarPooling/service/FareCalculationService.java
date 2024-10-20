package com.chay.CarPooling.service;

import com.chay.CarPooling.model.Trip;
import org.springframework.http.ResponseEntity;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

public interface FareCalculationService {
    double calculateFare(Trip trip);
    double[] getDistanceAndDurationFromAPI(String startLatitude, String startLongitude, String endLatitude, String endLongitude);
//    String getWeatherConditions(String latitude, String longitude);
    Double getGasPrice(String Latitude, String Longitude, String gasolineOrDiesel);

}
