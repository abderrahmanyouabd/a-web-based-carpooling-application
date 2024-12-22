package com.chay.CarPooling.controller;

import com.chay.CarPooling.domain.ChatNotification;
import com.chay.CarPooling.model.ChatMessage;
import com.chay.CarPooling.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
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

//    @MessageMapping("/chat")
//    public void processMessage(@Payload ChatMessage chatMessage) {
//        System.out.println("Processing message: " + chatMessage);
//        ChatMessage savedMsg = chatMessageService.save(chatMessage);
//        ChatNotification payload = ChatNotification.builder()
//                .id(savedMsg.getChatId())
//                .content(savedMsg.getContent())
//                .senderId(savedMsg.getSenderId())
//                .senderName(savedMsg.getSenderName())
//                .recipientId(savedMsg.getRecipientId())
//                .timestamp(savedMsg.getTimestamp())
//                .recipientName(savedMsg.getRecipientName())
//                .build();
//
//        System.out.println("Sending message to recipient: " + chatMessage.getRecipientId());
//        System.out.println("Active WebSocket users: " + simpUserRegistry.getUsers());
//        try {
//            messagingTemplate.convertAndSendToUser(
//                    String.valueOf(chatMessage.getRecipientId()), // Ensure this matches the recipient's subscription
//                    "/queue/messages",
//                    payload
//            );
//            System.out.println("Message successfully sent to: /user/"
//                    + chatMessage.getRecipientId() + "/queue/messages");
//        } catch (Exception e) {
//            System.err.println("Error sending message to recipient: " + e.getMessage());
//        }
//    }

    @MessageMapping("/chat")
    public void processGroupMessage(@Payload ChatMessage chatMessage) {
        System.out.println("Broadcasting message to group: " + chatMessage);

        // Save the message if needed
        chatMessageService.save(chatMessage);

        // Broadcast the message to the group
        messagingTemplate.convertAndSend("/topic/public", chatMessage);
    }

    @GetMapping("/messages/group")
    public ResponseEntity<List<ChatMessage>> getGroupChatMessages() {
        // Retrieve all messages meant for the group chat
        List<ChatMessage> groupMessages = chatMessageService.findGroupMessages();
        return ResponseEntity.ok(groupMessages);
    }


    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable Long senderId, @PathVariable Long recipientId) {
        return ResponseEntity.ok(chatMessageService.findChatMessages(senderId, recipientId));
    }

}
