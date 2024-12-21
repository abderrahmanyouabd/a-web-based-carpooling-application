package com.chay.CarPooling.service;

import java.util.Optional;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
public interface ChatRoomService {
    Optional<String> getChatRoomId(Long senderId, Long recipientId, boolean createNewRoomIfNotExists);
}
