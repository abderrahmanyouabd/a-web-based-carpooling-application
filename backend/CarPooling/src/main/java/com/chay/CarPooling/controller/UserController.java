package com.chay.CarPooling.controller;

import com.chay.CarPooling.exception.UserException;
import com.chay.CarPooling.model.User;
import com.chay.CarPooling.repository.UserRepository;
import com.chay.CarPooling.request.UpdateUserDto;
import com.chay.CarPooling.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;


    @GetMapping("profile")
    public ResponseEntity<User> getProfile(@RequestHeader("Authorization") String jwt) {

        User user = userService.findUserProfileByJwt(jwt);
        user.setPassword(null); // todo: I need to change this later and return a proper dto domain
        return new ResponseEntity<>(user, HttpStatus.ACCEPTED);
    }


    @PatchMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<User> UpdateUserProfileHandler(
            @ModelAttribute UpdateUserDto dto,
            @RequestHeader("Authorization") String jwt) throws UserException {

        User user = userService.findUserProfileByJwt(jwt);
        User updatedUser = userService.updateUser(dto,user);

        return new ResponseEntity<>(updatedUser, HttpStatus.ACCEPTED);
    }
}
