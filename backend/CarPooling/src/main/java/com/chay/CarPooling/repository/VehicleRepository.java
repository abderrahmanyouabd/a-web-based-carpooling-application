package com.chay.CarPooling.repository;

import com.chay.CarPooling.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;


/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Vehicle findByUserId(Long userId);
}
