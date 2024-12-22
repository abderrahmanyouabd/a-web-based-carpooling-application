package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.model.ChatMessage;
import com.chay.CarPooling.repository.ChatMessageRepository;
import com.chay.CarPooling.service.ChatMessageService;
import com.chay.CarPooling.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

@Service
@RequiredArgsConstructor
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomService chatRoomService;

    @Override
    public ChatMessage save(ChatMessage chatMessage) {
        var chatId = chatRoomService.getChatRoomId(
                chatMessage.getSenderId(),
                chatMessage.getRecipientId(),
                true)
                .orElseThrow(); // TODO: create custom exception
        chatMessage.setChatId(chatId);
        return chatMessageRepository.save(chatMessage);
    }

    @Override
    public List<ChatMessage> findChatMessages(Long senderId, Long recipientId) {
        var chatId = chatRoomService.getChatRoomId(
                senderId,
                recipientId,
                false);
        return chatId.map(chatMessageRepository::findByChatId).orElse(new ArrayList<>());
    }

    @Override
    public List<ChatMessage> findGroupMessages() {
        return chatMessageRepository.findByRecipientIdIsNull();
    }

    @Override
    public List<ChatMessage> findMessagesByRideId(Long rideId) {
        return chatMessageRepository.findByRideId(rideId);
    }

}
