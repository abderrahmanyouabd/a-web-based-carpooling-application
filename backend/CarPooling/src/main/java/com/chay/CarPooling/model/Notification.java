package com.chay.CarPooling.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String message;
    private LocalDateTime sentAt;
    private Long rideId;
    private Long recipient; // Email or user id
}
