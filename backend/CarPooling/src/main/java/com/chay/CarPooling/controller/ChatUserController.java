package com.chay.CarPooling.controller;

import com.chay.CarPooling.model.ChatUser;
import com.chay.CarPooling.model.Trip;
import com.chay.CarPooling.model.User;
import com.chay.CarPooling.service.ChatUserService;
import com.chay.CarPooling.service.TripService;
import com.chay.CarPooling.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@RestController
@RequiredArgsConstructor
public class ChatUserController {
    private final ChatUserService chatUserService;
    private final UserService userService;
    private final TripService tripService;

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
