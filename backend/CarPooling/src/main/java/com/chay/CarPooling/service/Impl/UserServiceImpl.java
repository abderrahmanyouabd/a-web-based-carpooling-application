package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.config.JwtProvider;
import com.chay.CarPooling.domain.UserRole;
import com.chay.CarPooling.model.User;
import com.chay.CarPooling.repository.UserRepository;
import com.chay.CarPooling.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.expression.ExpressionException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;


    @Override
    public User findUserProfileByJwt(String jwt) {
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ExpressionException("user doesn't exist with email" + email);
        }
        System.out.println("email user " + user.getEmail());
        return user;
    }

    @Override
    public User findUserByEmail(String email) {
        return null;
    }

    @Override
    public List<User> findAllUsers() {
        return List.of();
    }

    @Override
    public UserRole getUserRole(User user) {
        return null;
    }
}
