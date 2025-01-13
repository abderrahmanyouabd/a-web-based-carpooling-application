package com.chay.CarPooling.repository;

import com.chay.CarPooling.model.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Repository
public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    Optional<ChatRoom> findBySenderIdAndRecipientId(Long senderId, Long recipientId);

}
