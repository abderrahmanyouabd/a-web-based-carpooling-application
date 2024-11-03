package com.chay.CarPooling.service;

import com.chay.CarPooling.model.User;
import com.chay.CarPooling.model.Vehicle;

import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
public interface VehicleService {
    Vehicle createVehicle(Vehicle vehicle, User user);
    List<Vehicle> getUsersVehicles(User user);
    void deleteVehicle(Vehicle vehicle,User user) throws Exception;
    Vehicle findUserVehicle(User user) throws Exception;
}