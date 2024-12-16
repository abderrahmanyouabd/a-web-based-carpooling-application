package com.chay.CarPooling.service;

import com.chay.CarPooling.model.Trip;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

public interface FareCalculationService {
//    BigDecimal calculateFare2(Trip trip);
    BigDecimal calculateFareOnxx(Trip trip);
//    double[] getDistanceAndDurationFromAPI(String startLatitude, String startLongitude, String endLatitude, String endLongitude);
//    String getWeatherConditions(String latitude, String longitude);
//    Double getGasPrice(String Latitude, String Longitude, String gasolineOrDiesel);

}
