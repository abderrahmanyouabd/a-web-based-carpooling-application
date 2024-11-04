package com.chay.CarPooling.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Entity
@Data
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

    private @NonNull String token;

    @ManyToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    private @NonNull User user;

    private @NonNull Date expiryDate;

    public boolean isExpired() {return expiryDate.before(new Date());}
}
