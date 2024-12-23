package com.chay.CarPooling.controller;

import com.chay.CarPooling.model.Notification;
import com.chay.CarPooling.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @MessageMapping("/notify") // Maps to "/app/notify"
    public void sendNotification(String notificationMessage) {
        notificationService.broadcastNotification(notificationMessage);
    }

    @GetMapping("/ride/{rideId}")
    public ResponseEntity<List<Notification>> getNotificationsByRideId(@PathVariable Long rideId) {
        List<Notification> notifications = notificationService.getNotificationsByRideId(rideId);
        return ResponseEntity.ok(notifications);
    }
}
