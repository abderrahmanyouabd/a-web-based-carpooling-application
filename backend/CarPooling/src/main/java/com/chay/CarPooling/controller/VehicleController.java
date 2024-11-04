package com.chay.CarPooling.controller;

import com.chay.CarPooling.exception.UserException;
import com.chay.CarPooling.model.User;
import com.chay.CarPooling.model.Vehicle;
import com.chay.CarPooling.service.UserService;
import com.chay.CarPooling.service.VehicleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Vehicle> createOrUpdateVehicle(@RequestBody Vehicle vehicle,
                                                         Authentication authentication) throws UserException {
        String email = (String) authentication.getPrincipal();
        User user = userService.findUserByEmail(email);

        Vehicle savedVehicle = vehicleService.createOrUpdateVehicle(vehicle, user);
        return ResponseEntity.ok(savedVehicle);
    }

    @GetMapping
    public ResponseEntity<Vehicle> getUserVehicle(Authentication authentication) throws UserException {
        String email = (String) authentication.getPrincipal();
        User user = userService.findUserByEmail(email);

        Vehicle vehicle = vehicleService.findUserVehicle(user);
        return ResponseEntity.ok(vehicle);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteUserVehicle(Authentication authentication) throws Exception {
        String email = (String) authentication.getPrincipal();
        User user = userService.findUserByEmail(email);
        Vehicle vehicle = vehicleService.findUserVehicle(user);

        if (vehicle != null) {
            vehicleService.deleteVehicle(vehicle, user);
        } else {
            throw new Exception("No vehicle found for this user.");
        }
        return ResponseEntity.noContent().build();
    }

}
