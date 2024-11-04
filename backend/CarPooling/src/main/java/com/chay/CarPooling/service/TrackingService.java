package com.chay.CarPooling.service;

import com.chay.CarPooling.model.User;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
public interface TrackingService {

    String updateDriverLocation(User driver, String ipAddress);
    User findDriverById(Long driverId);
}
