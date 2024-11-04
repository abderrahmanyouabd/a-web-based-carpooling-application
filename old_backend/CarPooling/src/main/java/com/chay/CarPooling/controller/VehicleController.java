package com.chay.CarPooling.controller;

import com.chay.CarPooling.exception.UserException;
import com.chay.CarPooling.model.User;
import com.chay.CarPooling.model.Vehicle;
import com.chay.CarPooling.service.UserService;
import com.chay.CarPooling.service.VehicleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@RestController
@RequestMapping("/api/vehicle")
public class VehicleController {
    private final VehicleService vehicleService;
    private final UserService userService;

    public VehicleController(VehicleService vehicleService, UserService userService) {
        this.vehicleService = vehicleService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle,
                                                 Authentication authentication) throws UserException {
        String email = (String) authentication.getPrincipal();
        User user = userService.findUserByEmail(email);

        Vehicle createdVehicle = vehicleService.createVehicle(vehicle, user);
        return ResponseEntity.ok(createdVehicle);
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getUsersVehicles(
            Authentication authentication) throws UserException {
        String email = (String) authentication.getPrincipal();
        User user = userService.findUserByEmail(email);


        List<Vehicle> vehicles = vehicleService.getUsersVehicles(user);
        return ResponseEntity.ok(vehicles);
//        return null;
    }

    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long vehicleId, Authentication authentication) throws Exception {
        String email = (String) authentication.getPrincipal();
        User user = userService.findUserByEmail(email);

        Vehicle vehicle = vehicleService.getUsersVehicles(user)
                .stream()
                .filter(v -> v.getId().equals(vehicleId))
                .findFirst()
                .orElseThrow(() -> new Exception("Vehicle not found"));

        vehicleService.deleteVehicle(vehicle, user);
        return ResponseEntity.noContent().build();
    }
}
