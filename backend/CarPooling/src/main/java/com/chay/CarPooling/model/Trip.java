package com.chay.CarPooling.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@Table(name = "trip")
@NoArgsConstructor
@AllArgsConstructor
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer availableSeats;
    private double pricePerSeat;
    private String departLatitude;
    private String departLongitude;

    private String arrivalLatitude;
    private String arrivalLongitude;

    private String departName;
    private String arrivalName;
    private String departTime;
    private String arrivalTime;

    @ManyToMany
    private Set<User> passengers = new HashSet<>();

    @ElementCollection
    private List<Station> stations;


    @ManyToOne
    private User driver;

}
