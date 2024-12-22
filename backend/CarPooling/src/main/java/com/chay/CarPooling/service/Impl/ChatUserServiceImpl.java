package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.domain.UserStatus;
import com.chay.CarPooling.model.ChatUser;
import com.chay.CarPooling.repository.ChatUserRepository;
import com.chay.CarPooling.service.ChatUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Service
@RequiredArgsConstructor
public class ChatUserServiceImpl implements ChatUserService {

    private final ChatUserRepository chatUserRepository;

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
}
