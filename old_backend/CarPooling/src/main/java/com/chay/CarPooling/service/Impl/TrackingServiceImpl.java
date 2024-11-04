package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.model.User;
import com.chay.CarPooling.repository.UserRepository;
import com.chay.CarPooling.service.TrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

@Service
@RequiredArgsConstructor
public class TrackingServiceImpl implements TrackingService {

    private final UserRepository userRepository;

    @Override
    public String updateDriverLocation(User driver, String ipAddress) {
        driver.setCurrentIpAddress(ipAddress);
        userRepository.save(driver);
        return ipAddress;
    }

    @Override
    public User findDriverById(Long driverId) {
        return userRepository.findById(driverId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
    }


}
