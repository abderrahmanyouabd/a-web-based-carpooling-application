package com.chay.CarPooling.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@EqualsAndHashCode(callSuper = false)
@Data
public class UserNotFoundException extends RuntimeException{
    private final String msg;
}
