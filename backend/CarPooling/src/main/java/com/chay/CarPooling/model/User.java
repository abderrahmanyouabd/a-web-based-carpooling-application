package com.chay.CarPooling.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Entity
@Data
@Table(schema = "userr")
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullName;

    @Email(message = "Email is not valid")
    private String email;
    private String password;
    private String phone;
    private String dateOfBirth;
    private String gender;
    private String country;
}
