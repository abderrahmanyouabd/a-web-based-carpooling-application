package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.model.User;
import com.chay.CarPooling.model.Vehicle;
import com.chay.CarPooling.repository.VehicleRepository;
import com.chay.CarPooling.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    @Autowired
    public VehicleServiceImpl(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public Vehicle createVehicle(Vehicle vehicle, User user) {
        vehicle.setUser(user);
        return vehicleRepository.save(vehicle);
    }

    @Override
    public List<Vehicle> getUsersVehicles(User user) {
        return vehicleRepository.getVehicleByUserId(user.getId());
    }

    @Override
    public void deleteVehicle(Vehicle vehicle,User user) throws Exception {
        if(user.getId().equals(vehicle.getUser().getId())){
            vehicleRepository.delete(vehicle);
        }
        else throw new Exception("you don't have access");
    }

}
