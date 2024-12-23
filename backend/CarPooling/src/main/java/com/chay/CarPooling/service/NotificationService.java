package com.chay.CarPooling.service;

import com.chay.CarPooling.model.Notification;

import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

public interface NotificationService {
    void sendNotificationToRide(Long rideId, String message, Long senderId);
    void broadcastNotification(String message);
    Notification saveNotification(Notification notification);
    List<Notification> getNotificationsByRideId(Long rideId);
}
