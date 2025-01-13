package com.chay.CarPooling.controller;

import com.chay.CarPooling.model.ChatMessage;
import com.chay.CarPooling.service.ChatMessageService;
import com.chay.CarPooling.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@RestController
@RequiredArgsConstructor
public class ChatController {
    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final SimpUserRegistry simpUserRegistry;
    private final NotificationService notificationService;

    @GetMapping("/messages/ride/{rideId}")
    public ResponseEntity<List<ChatMessage>> getMessagesByRideId(@PathVariable Long rideId) {
        List<ChatMessage> messages = chatMessageService.findMessagesByRideId(rideId);
        return ResponseEntity.ok(messages);
    }



    @MessageMapping("/chat/ride/{rideId}")
    public void processRideMessage(@DestinationVariable Long rideId, @Payload ChatMessage chatMessage) {
        System.out.println("Received message for rideId: " + rideId);
        chatMessage.setRideId(rideId);
        ChatMessage savedMessage = chatMessageService.save(chatMessage);
        System.out.println("Message content: " + savedMessage);
        messagingTemplate.convertAndSend("/topic/ride/" + rideId, savedMessage);
        System.out.println("Broadcasted message to /topic/ride/" + rideId);

        // Send a notification to all users in the ride
        String notificationMessage = "New message in ride " + rideId + ": " + savedMessage.getContent();
        notificationService.sendNotificationToRide(rideId, notificationMessage, savedMessage.getSenderId());
        System.out.println("Notification sent to /topic/notification/" + rideId);
    }



}
