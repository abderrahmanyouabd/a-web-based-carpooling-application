package com.chay.CarPooling.service;

import com.chay.CarPooling.model.PasswordResetToken;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

public interface PasswordResetTokenService {
    public PasswordResetToken findByToken(String token);
    public void delete(PasswordResetToken resetToken);
}
