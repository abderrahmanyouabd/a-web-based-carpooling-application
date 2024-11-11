package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.model.User;
import com.chay.CarPooling.model.Vehicle;
import com.chay.CarPooling.repository.VehicleRepository;
import com.chay.CarPooling.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    @Autowired
    public VehicleServiceImpl(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public Vehicle createOrUpdateVehicle(Vehicle newVehicle, User user) {
        Vehicle existingVehicle = findUserVehicle(user);
        if (existingVehicle != null) {
            existingVehicle.setModel(newVehicle.getModel());
            existingVehicle.setColor(newVehicle.getColor());
            existingVehicle.setLicensePlateNumber(newVehicle.getLicensePlateNumber());
            existingVehicle.setBrand(newVehicle.getBrand());
            existingVehicle.setGasType(newVehicle.getGasType());
            return vehicleRepository.save(existingVehicle);
        } else {
            newVehicle.setUser(user);
            return vehicleRepository.save(newVehicle);
        }
    }


    @Override
    public Vehicle findUserVehicle(User user) {
        return vehicleRepository.findByUserId(user.getId()) == null? null: vehicleRepository.findByUserId(user.getId());
    }

    @Override
    @Transactional
    public void deleteVehicle(Vehicle vehicle, User user) throws Exception {
        if (vehicle != null) {
            System.out.println("Attempting to delete vehicle with ID: " + vehicle.getId());
            if (vehicle.getUser().getId().equals(user.getId())) {
                user.setVehicle(null);
                vehicleRepository.delete(vehicle);
                System.out.println("Vehicle with ID " + vehicle.getId() + " has been deleted.");
            } else {
                throw new Exception("You don't have access to delete this vehicle.");
            }
        } else {
            throw new Exception("Vehicle is null.");
        }
    }
}