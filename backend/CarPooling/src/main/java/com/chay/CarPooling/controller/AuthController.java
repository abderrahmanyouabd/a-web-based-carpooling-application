package com.chay.CarPooling.controller;

import com.chay.CarPooling.model.User;
import com.chay.CarPooling.repository.UserRepository;
import com.chay.CarPooling.request.LoginRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

@RestController
@RequestMapping("/auth")
@Slf4j
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @PostMapping("signup")
    public ResponseEntity<Long> signUp(@RequestBody LoginRequest loginRequest) throws Exception {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();


        User ExistingUserIfAny = userRepository.findByEmail(email);

        if(ExistingUserIfAny != null) {
            throw new Exception("Email is used with another account");
        }

        // todo: create user
        User createdUser = new User();
        createdUser.setEmail(email);
        createdUser.setPassword(password);

        User savedUser = userRepository.save(createdUser);

        return ResponseEntity.ok(savedUser.getId());
    }

    @PostMapping("login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) throws Exception {
        String email = loginRequest.getEmail();
        log.info("provided email: {}", email);
        String password = loginRequest.getPassword();
        log.info("provided  password: {}", password);
        User existingUser = userRepository.findByEmail(email);
        log.info("found user: {}", existingUser);
        if (existingUser != null) {
            if(existingUser.getPassword().equals(password)) {
                return ResponseEntity.ok("User authenticated : user_id: "  + existingUser.getId());
            } else {
                return ResponseEntity.ok("wrong credentials");
            }
        } else {
            throw new Exception("User not found");
        }
    }


}
