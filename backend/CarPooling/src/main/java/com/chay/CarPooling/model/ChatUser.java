package com.chay.CarPooling.model;

import com.chay.CarPooling.domain.UserStatus;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Document(collection = "chat_user")
@Data
public class ChatUser {
    @Id
    private Long chatUserId;
    private String fullName;
    private UserStatus status;

}
