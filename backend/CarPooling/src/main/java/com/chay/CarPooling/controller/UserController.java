package com.chay.CarPooling.controller;

import com.chay.CarPooling.exception.UserException;
import com.chay.CarPooling.model.User;
import com.chay.CarPooling.repository.UserRepository;
import com.chay.CarPooling.request.UpdateUserDto;
import com.chay.CarPooling.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


    @PatchMapping()
    public ResponseEntity<User> updateUserProfileHandler(
            @RequestPart(value = "fullName", required = false) String fullName,
            @RequestPart(value = "email", required = false) String email,
            @RequestPart(value = "mobile", required = false) String mobile,
            @RequestPart(value = "dateOfBirth", required = false) String dateOfBirth,
            @RequestPart(value = "bio", required = false) String bio,
            @RequestPart(value = "profilePicture", required = false) byte[] profilePicture,
            @RequestHeader("Authorization") String jwt) throws UserException {

        User user = userService.findUserProfileByJwt(jwt);


        if (fullName != null) user.setFullName(fullName);
        if (email != null) user.setEmail(email);
        if (mobile != null) user.setMobile(mobile);
        if (dateOfBirth != null) user.setDateOfBirth(dateOfBirth);
        if (bio != null) user.setBio(bio);
        if (profilePicture != null) user.setProfilePicture(profilePicture);

        User updatedUser = userRepository.save(user);
        return new ResponseEntity<>(updatedUser, HttpStatus.ACCEPTED);
    }
}
