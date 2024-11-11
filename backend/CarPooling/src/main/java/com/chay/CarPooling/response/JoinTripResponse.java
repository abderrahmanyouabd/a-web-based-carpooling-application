package com.chay.CarPooling.response;

import com.chay.CarPooling.model.Trip;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Data
@AllArgsConstructor
public class JoinTripResponse {
    private Trip trip;
    private String clientSecret;
    private String message;
}