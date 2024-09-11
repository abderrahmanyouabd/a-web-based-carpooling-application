package com.chay.CarPooling.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Table(schema = "station")
@NoArgsConstructor
@AllArgsConstructor
public class Station {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stationId;

    private Long carId;
    private Long userId;
    private String stationName;
    private LocalDateTime departureTime;
    private int numberOfPeople;
    private String location;
    private String longitude;
    private String latitude;
}
