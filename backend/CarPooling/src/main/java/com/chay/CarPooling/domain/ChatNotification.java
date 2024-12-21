package com.chay.CarPooling.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatNotification {

    private String id;
    private Long senderId;
    private String senderName;
    private String content;
    private Long recipientId;
    private String recipientName;
    private Date timestamp;

}
