package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.model.ChatRoom;
import com.chay.CarPooling.repository.ChatRoomRepository;
import com.chay.CarPooling.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Service
@RequiredArgsConstructor
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    @Override
    public Optional<String> getChatRoomId(Long senderId, Long recipientId, boolean createNewRoomIfNotExists) {
        return chatRoomRepository.findBySenderIdAndRecipientId(senderId, recipientId)
                .map(ChatRoom::getChatId)
                .or(() -> {
            if (createNewRoomIfNotExists) {
                var chatId = createChat(senderId, recipientId);
                return Optional.of(chatId);
            } else {
                return Optional.empty();
            }
        });
    }

    private String createChat(Long senderId, Long recipientId) {
        var chatId = String.format("%d_%d", senderId, recipientId); // 123_428
        ChatRoom senderRecipient = ChatRoom.builder()
                .ChatId(chatId)
                .senderId(senderId)
                .recipientId(recipientId)
                .build();
        ChatRoom recipientSender = ChatRoom.builder()
                .ChatId(chatId)
                .senderId(recipientId)
                .recipientId(senderId)
                .build();
        chatRoomRepository.save(senderRecipient);
        chatRoomRepository.save(recipientSender);
        return chatId;

    }
}
