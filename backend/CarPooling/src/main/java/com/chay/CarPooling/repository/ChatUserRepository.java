package com.chay.CarPooling.repository;

import com.chay.CarPooling.model.ChatUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Repository
public interface ChatUserRepository extends MongoRepository<ChatUser, Long> {
}
