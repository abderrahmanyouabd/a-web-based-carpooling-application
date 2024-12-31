package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.domain.UserStatus;
import com.chay.CarPooling.model.ChatUser;
import com.chay.CarPooling.model.Trip;
import com.chay.CarPooling.model.User;
import com.chay.CarPooling.repository.ChatUserRepository;
import com.chay.CarPooling.service.ChatUserService;
import com.chay.CarPooling.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Service
@RequiredArgsConstructor
public class ChatUserServiceImpl implements ChatUserService {

    private final ChatUserRepository chatUserRepository;
    private final TripService tripService;

    @Override
    public void saveChatUser(ChatUser user) {
        user.setStatus(UserStatus.ONLINE);
        chatUserRepository.save(user);
    }

    @Override
    public void disconnectChatUser(ChatUser user) {
        var storedChatUser = chatUserRepository.findById(user.getChatUserId()).orElse(null);
        if (storedChatUser != null) {
            storedChatUser.setStatus(UserStatus.OFFLINE);
            chatUserRepository.save(storedChatUser);
        }
    }

    @Override
    public List<ChatUser> findConnectedUsers() {
        return chatUserRepository.findAllById(chatUserRepository.findAll().stream()
                .filter(user -> user.getStatus().equals(UserStatus.ONLINE))
                .map(ChatUser::getChatUserId)
                .toList());
    }

    @Override
    public List<ChatUser> findConnectedUsersByPassengerIds(List<Long> passengerIds) {
        return chatUserRepository.findAllById(chatUserRepository.findAll().stream()
                .filter(user -> user.getStatus().equals(UserStatus.ONLINE) && passengerIds.contains(user.getChatUserId()))
                .map(ChatUser::getChatUserId)
                .toList());
    }

    @Override
    public List<ChatUser> findConnectedUsersByRideId(Long rideId) {
        try{
        Trip trip = tripService.getTripById(rideId);
        List<Long> ids = trip.getPassengers().stream().map(User::getId).collect(Collectors.toList());
        System.out.println(ids);
        ids.add(0, trip.getDriver().getId());
            List<ChatUser> ListOfConnectedUsers = chatUserRepository.findAllById(chatUserRepository.findAll().stream()
                    .filter(user -> user.getStatus().equals(UserStatus.ONLINE) && ids.contains(user.getChatUserId()))
                    .map(ChatUser::getChatUserId)
                    .distinct().toList());
            System.out.println(ListOfConnectedUsers);

            return ListOfConnectedUsers;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }


}
