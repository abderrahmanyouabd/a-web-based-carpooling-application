package com.chay.CarPooling.service;

import com.chay.CarPooling.model.ChatMessage;

import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
public interface ChatMessageService {
    ChatMessage save(ChatMessage chatMessage);
    List<ChatMessage> findChatMessages(Long senderId, Long recipientId);
}
