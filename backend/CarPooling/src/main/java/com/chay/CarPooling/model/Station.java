package com.chay.CarPooling.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Station {

    private String name;
    private String location;
    private String longitude;
    private String latitude;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
}
