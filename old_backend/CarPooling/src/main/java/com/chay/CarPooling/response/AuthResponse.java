package com.chay.CarPooling.response;

import lombok.Data;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Data
public class AuthResponse {
    private String message;
    private String jwt;
}
