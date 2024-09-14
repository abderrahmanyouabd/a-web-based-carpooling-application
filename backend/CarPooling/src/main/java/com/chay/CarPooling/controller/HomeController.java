package com.chay.CarPooling.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@RestController
public class HomeController {

    @GetMapping("/home")
    public ResponseEntity<String> Home() {
        return new ResponseEntity<>("Welcome ...", HttpStatus.OK);
    }
}
