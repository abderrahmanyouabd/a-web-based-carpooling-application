package com.chay.CarPooling.controller;

import com.chay.CarPooling.exception.UserNotFoundException;
import com.chay.CarPooling.model.PasswordResetToken;
import com.chay.CarPooling.model.User;
import com.chay.CarPooling.request.ResetPasswordRequest;
import com.chay.CarPooling.response.ApiResponse;
import com.chay.CarPooling.service.PasswordResetTokenService;
import com.chay.CarPooling.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

@RestController
public class ResetPasswordController {


    @Autowired
    private PasswordResetTokenService passwordResetTokenService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse> resetPassword(

            @RequestBody ResetPasswordRequest req) throws UserNotFoundException {

        PasswordResetToken resetToken = passwordResetTokenService.findByToken(req.getToken());

        if (resetToken == null ) {
            throw new UserNotFoundException("token is required...");
        }
        if(resetToken.isExpired()) {
            passwordResetTokenService.delete(resetToken);
            throw new UserNotFoundException("token get expired...");

        }

        // Update user's password
        User user = resetToken.getUser();
        userService.updatePassword(user, req.getPassword());

        // Delete the token
        passwordResetTokenService.delete(resetToken);

        ApiResponse res=new ApiResponse();
        res.setMessage("Password updated successfully.");
        res.setStatus(true);

        return ResponseEntity.ok(res);
    }

    @PostMapping("/reset")
    public ResponseEntity<ApiResponse> resetPassword(@RequestParam("email") String email) throws UserNotFoundException {
        User user = userService.findUserByEmail(email);
        System.out.println("ResetPasswordController.resetPassword()");

        if (user == null) {
            throw new UserNotFoundException("user not found");
        }

        userService.sendPasswordResetEmail(user);

        ApiResponse res=new ApiResponse();
        res.setMessage("Password reset email sent successfully.");
        res.setStatus(true);

        return ResponseEntity.ok(res);
    }
}
