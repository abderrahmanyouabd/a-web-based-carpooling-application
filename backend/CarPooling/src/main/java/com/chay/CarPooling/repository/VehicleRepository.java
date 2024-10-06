package com.chay.CarPooling.repository;

import com.chay.CarPooling.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> getVehicleByUserId(Long userId);
}
