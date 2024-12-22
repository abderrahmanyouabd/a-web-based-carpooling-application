package com.chay.CarPooling.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "chat_message")
public class ChatMessage {
    private String chatId;
    private Long senderId;
    private Long rideId;
    private Long recipientId;
    private String senderName;
    private String recipientName;
    private String content;
    private Date timestamp;

}
