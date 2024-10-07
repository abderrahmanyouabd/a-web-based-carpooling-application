package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.model.PasswordResetToken;
import com.chay.CarPooling.repository.PasswordResetTokenRepository;
import com.chay.CarPooling.service.PasswordResetTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Service
@RequiredArgsConstructor
public class PasswordResetTokenServiceImpl implements PasswordResetTokenService {
    private final PasswordResetTokenRepository passwordResetTokenRepository;


    @Override
    public PasswordResetToken findByToken(String token) {
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token);
        return passwordResetToken;
    }

    @Override
    public void delete(PasswordResetToken resetToken) {
        passwordResetTokenRepository.delete(resetToken);
    }
}
