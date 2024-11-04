package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.model.User;
import com.chay.CarPooling.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Service
public class CustomeUserServiceImplementation implements UserDetailsService {

    private UserRepository userRepository;

    public CustomeUserServiceImplementation(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // Fetch user from the database
        User user = userRepository.findByEmail(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found with email - " + username);
        }

        // Create a list of GrantedAuthority and assign the user's role
        List<GrantedAuthority> authorities = new ArrayList<>();

        // Assuming user.getRole() returns an enum like UserRole.USER_ROLE
        authorities.add(new SimpleGrantedAuthority(user.getRole().name()));

        // Return the UserDetails object with the user's email, password, and authorities
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities);
    }
}