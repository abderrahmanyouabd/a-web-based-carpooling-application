package com.chay.CarPooling.model;

import com.chay.CarPooling.domain.GasType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@Table(name = "vehicle")
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String model;
    private String color;
    private String licensePlateNumber;
    private String brand;
    @Enumerated(EnumType.STRING)
    private GasType gasType;

    @OneToOne
    private User user;
}
