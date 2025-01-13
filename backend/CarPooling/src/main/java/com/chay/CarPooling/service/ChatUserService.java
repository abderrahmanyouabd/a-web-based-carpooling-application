package com.chay.CarPooling.service;

import com.chay.CarPooling.model.ChatUser;

import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
public interface ChatUserService {
    void saveChatUser(ChatUser user);
    void disconnectChatUser(ChatUser user);
    List<ChatUser> findConnectedUsers();
    List<ChatUser> findConnectedUsersByPassengerIds(List<Long> passengerIds);
    List<ChatUser> findConnectedUsersByRideId(Long rideId);
}
