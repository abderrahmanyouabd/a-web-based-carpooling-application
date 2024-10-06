package com.chay.CarPooling.repository;

import com.chay.CarPooling.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    PasswordResetToken findByToken(String token);
}
