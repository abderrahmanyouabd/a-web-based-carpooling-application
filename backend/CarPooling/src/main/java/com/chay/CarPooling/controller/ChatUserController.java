package com.chay.CarPooling.controller;

import com.chay.CarPooling.model.ChatUser;
import com.chay.CarPooling.service.ChatUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@RestController
@RequiredArgsConstructor
public class ChatUserController {
    private final ChatUserService chatUserService;

    @MessageMapping("/user.addUser")
    @SendTo("/topic/public")
    public ChatUser addChatUser(@Payload ChatUser user) {
        System.out.println("User added: " + user);
        chatUserService.saveChatUser(user);
        return user;
    }

    @MessageMapping("/user.disconnectUser")
    @SendTo("/topic/public")
    public ChatUser disconnectChatUser(@Payload ChatUser user) {
        chatUserService.disconnectChatUser(user);
        return user;
    }

    @GetMapping("/connected-users")
    public ResponseEntity<List<ChatUser>> getConnectedUsers(@RequestParam Long rideId) {
        return ResponseEntity.ok(chatUserService.findConnectedUsersByRideId(rideId));
    }

}
