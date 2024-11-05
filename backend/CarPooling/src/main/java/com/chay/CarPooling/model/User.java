package com.chay.CarPooling.model;

import com.chay.CarPooling.domain.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Entity
@Data
@Table(name = "\"user\"")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String fullName;
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String mobile;
    private String bio;

    @Lob
    private byte[] profilePicture;
    private String dateOfBirth;

    private String status;

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.USER_ROLE;

    @Enumerated(EnumType.STRING)
    private ChatPreference chatPreference=ChatPreference.IM_THE_QUIET_TYPE;

    @Enumerated(EnumType.STRING)
    private PlaylistPreference playlistPreference;

    @Enumerated(EnumType.STRING)
    private SmokingPreference smokingPreference;

    @Enumerated(EnumType.STRING)
    private PetPreference petPreference;

    @OneToOne(mappedBy = "user", cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, optional = true)
    private Vehicle vehicle;

    private String currentIpAddress;

}
