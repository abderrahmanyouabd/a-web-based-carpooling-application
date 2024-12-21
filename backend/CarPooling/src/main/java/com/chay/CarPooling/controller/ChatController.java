package com.chay.CarPooling.controller;

import com.chay.CarPooling.domain.ChatNotification;
import com.chay.CarPooling.model.ChatMessage;
import com.chay.CarPooling.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        ChatMessage savedMsg = chatMessageService.save(chatMessage);
        ChatNotification payload = ChatNotification.builder()
                .id(savedMsg.getChatId())
                .content(savedMsg.getContent())
                .senderId(savedMsg.getSenderId())
                .senderName(savedMsg.getSenderName())
                .recipientId(savedMsg.getRecipientId())
                .timestamp(savedMsg.getTimestamp())
                .recipientName(savedMsg.getRecipientName())
                .build();
        messagingTemplate.convertAndSendToUser(
                String.valueOf(chatMessage.getRecipientId()),
                "/queue/messages",
                payload);
    }


    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable Long senderId, @PathVariable Long recipientId) {
        return ResponseEntity.ok(chatMessageService.findChatMessages(senderId, recipientId));
    }

}
