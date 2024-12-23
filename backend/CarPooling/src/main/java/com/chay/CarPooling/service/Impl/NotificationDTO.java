package com.chay.CarPooling.service.Impl;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
public class NotificationDTO {
    private Long rideId;
    private String message;
    private String sentAt;
    private Long senderId;


    public NotificationDTO(Long rideId, String message, LocalDateTime sentAt, Long senderId) {
        this.rideId = rideId;
        this.message = message;
        this.sentAt = sentAt.toString();
        this.senderId = senderId;
    }
}
