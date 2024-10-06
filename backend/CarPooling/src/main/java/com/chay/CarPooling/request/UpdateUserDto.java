package com.chay.CarPooling.request;

import com.chay.CarPooling.domain.ChatPreference;
import com.chay.CarPooling.domain.PetPreference;
import com.chay.CarPooling.domain.PlaylistPreference;
import com.chay.CarPooling.domain.SmokingPreference;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserDto {
    private String fullName;
    private String email;
    private String mobile;
    private String dateOfBirth;
    private String bio;
    private String profilePicture;

    @Enumerated(EnumType.STRING)
    private ChatPreference chatPreference;

    @Enumerated(EnumType.STRING)
    private PlaylistPreference playlistPreference;

    @Enumerated(EnumType.STRING)
    private SmokingPreference smokingPreference;

    @Enumerated(EnumType.STRING)
    private PetPreference petPreference;
}