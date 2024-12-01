package com.chay.CarPooling.request;

import com.chay.CarPooling.domain.*;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

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
    private MultipartFile profilePicture;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private ChatPreference chatPreference;

    @Enumerated(EnumType.STRING)
    private PlaylistPreference playlistPreference;

    @Enumerated(EnumType.STRING)
    private SmokingPreference smokingPreference;

    @Enumerated(EnumType.STRING)
    private PetPreference petPreference;
}