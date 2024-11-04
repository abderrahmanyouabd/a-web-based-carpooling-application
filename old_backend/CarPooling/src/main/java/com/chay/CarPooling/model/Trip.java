package com.chay.CarPooling.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
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


    @AttributeOverrides({
            @AttributeOverride(name = "name",
                    column = @Column(name = "leaving_from_name")),
            @AttributeOverride(name = "location",
                    column = @Column(name = "leaving_from_location")),
            @AttributeOverride(name = "departureTime",
                    column = @Column(name = "leaving_from_departure_time")),
            @AttributeOverride(name = "arrivalTime",
                    column = @Column(name = "leaving_from_arrival_time")),
            @AttributeOverride(name = "latitude",
                    column = @Column(name = "leaving_from_latitude")),
            @AttributeOverride(name = "longitude",
                    column = @Column(name = "leaving_from_longitude"))
    })
    private Station leavingFrom;


    @AttributeOverrides({
            @AttributeOverride(name = "name",
                    column = @Column(name = "going_to_name")),
            @AttributeOverride(name = "location",
                    column = @Column(name = "going_to_location")),
            @AttributeOverride(name = "departureTime",
                    column = @Column(name = "going_to_departure_time")),
            @AttributeOverride(name = "arrivalTime",
                    column = @Column(name = "going_to_arrival_time")),
            @AttributeOverride(name = "latitude",
                    column = @Column(name = "going_to_latitude")),
            @AttributeOverride(name = "longitude",
                    column = @Column(name = "going_to_longitude"))
    })
    private Station goingTo;

    private LocalDate date;
    private LocalTime time;
    private Integer availableSeats;
    private BigDecimal farePerSeat;

    private String comment;

    @ManyToOne
    private User driver;

//    @OneToOne
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle; // The vehicle being used for the trip

    @ManyToMany
    private Set<User> passengers = new HashSet<>();


    @ElementCollection
    private List<Station> stations;
}
