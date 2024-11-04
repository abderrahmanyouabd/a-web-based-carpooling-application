package com.chay.CarPooling.service;

import com.chay.CarPooling.model.User;
import com.chay.CarPooling.model.Vehicle;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
public interface VehicleService {
    Vehicle createOrUpdateVehicle(Vehicle vehicle, User user);
    @Transactional
    void deleteVehicle(Vehicle vehicle,User user) throws Exception;
    Vehicle findUserVehicle(User user);
}