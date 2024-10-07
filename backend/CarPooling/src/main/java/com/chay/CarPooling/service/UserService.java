package com.chay.CarPooling.service;

import com.chay.CarPooling.domain.UserRole;
import com.chay.CarPooling.model.User;
import com.chay.CarPooling.request.UpdateUserDto;

import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

public interface UserService {

    public User findUserProfileByJwt(String jwt);

    public User findUserByEmail(String email);

    public List<User> findAllUsers();

    public UserRole getUserRole(User user);
    void updatePassword(User user, String newPassword);
    void sendPasswordResetEmail(User user);
    User updateUser(UpdateUserDto dto, User user);

}
