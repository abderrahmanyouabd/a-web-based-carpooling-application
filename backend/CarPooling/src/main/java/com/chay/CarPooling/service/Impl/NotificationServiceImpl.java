package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.model.Notification;
import com.chay.CarPooling.repository.NotificationRepository;
import com.chay.CarPooling.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;


    @Override
    public void sendNotificationToRide(Long rideId, String message, Long senderId) {
        // Save the notification
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setSentAt(LocalDateTime.now());
        notification.setRideId(rideId);
        notification.setRecipient(senderId); // Associate the notification with the sender
        notificationRepository.save(notification);

        // Send the notification to all ride participants except the sender
        messagingTemplate.convertAndSend(
                "/topic/notification/" + rideId,
                new NotificationDTO(rideId, message, LocalDateTime.now(), senderId) // Custom DTO
        );
    }


    @Override
    public void broadcastNotification(String message) {
        messagingTemplate.convertAndSend("/topic/notification", message);
    }

    @Override
    public Notification saveNotification(Notification notification) {
        notification.setSentAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getNotificationsByRideId(Long rideId) {
        return notificationRepository.findByRideId(rideId);
    }
}
