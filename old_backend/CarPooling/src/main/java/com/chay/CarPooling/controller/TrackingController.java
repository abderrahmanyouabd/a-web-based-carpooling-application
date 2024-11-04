package com.chay.CarPooling.controller;

import com.chay.CarPooling.model.User;
import com.chay.CarPooling.service.TrackingService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

@RestController
@RequestMapping("/auth/api/tracking")
@RequiredArgsConstructor
public class TrackingController {

    private final TrackingService trackingService;

    @PostMapping("/update-location")
    public ResponseEntity<Map<String, String>> updateDriverLocation(HttpServletRequest request, @RequestParam Long driverId) {
        String ipAddress = getClientIp(request);
        User driver = trackingService.findDriverById(driverId);

        String returnedIp = trackingService.updateDriverLocation(driver, ipAddress);

        Map<String, String> response = new HashMap<>();
        response.put("ipAddress", returnedIp);

        return ResponseEntity.ok(response);
    }


    private String getClientIp(HttpServletRequest request) {
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getRemoteAddr();
        }
        return clientIp;
    }
}
