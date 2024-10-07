package com.chay.CarPooling.request;

import lombok.Data;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Data
public class ResetPasswordRequest {
    private String password;
    private String token;
}
