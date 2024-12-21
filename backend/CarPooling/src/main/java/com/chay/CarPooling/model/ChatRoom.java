package com.chay.CarPooling.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "chat_room")
public class ChatRoom {

    @Id
    private String chatRoomId;
    private String ChatId;
    private String ChatName;
    private String ChatDescription;
    private Long senderId;
    private Long recipientId;
    private String senderName;
    private String receiverName;

}
