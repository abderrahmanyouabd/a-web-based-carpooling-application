package com.chay.CarPooling.controller;

import com.chay.CarPooling.config.JwtProvider;
import com.chay.CarPooling.domain.UserRole;
import com.chay.CarPooling.model.User;
import com.chay.CarPooling.repository.UserRepository;
import com.chay.CarPooling.request.LoginRequest;
import com.chay.CarPooling.response.AuthResponse;
import com.chay.CarPooling.service.Impl.CustomeUserServiceImplementation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final CustomeUserServiceImplementation customUserDetails;

//    public AuthController(UserRepository userRepository,
//                          PasswordEncoder passwordEncoder,
//                          JwtProvider jwtProvider,
//                          CustomeUserServiceImplementation customUserDetails,
//    ) {
//        this.userRepository = userRepository;
//        this.passwordEncoder = passwordEncoder;
//        this.jwtProvider = jwtProvider;
//        this.customUserDetails = customUserDetails;
//
//    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user){

        String email = user.getEmail();
        String password = user.getPassword();
        String fullName = user.getFullName();


        User isEmailExist = userRepository.findByEmail(email);

        if (isEmailExist!=null) {

            try {
                throw new Exception("Email Is Already Used With Another Account");
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

        // Create new user
        User createdUser = new User();
        createdUser.setEmail(email);
        createdUser.setFullName(fullName);
        createdUser.setPassword(passwordEncoder.encode(password));
        createdUser.setRole(UserRole.USER_ROLE);

        User savedUser = userRepository.save(createdUser);


//		List<GrantedAuthority> authorities=new ArrayList<>();
        List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList(createdUser.getRole().name());





        Authentication authentication = new UsernamePasswordAuthenticationToken(email, password,authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setMessage("Register Success");


        return new ResponseEntity<>(authResponse, HttpStatus.OK);

    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Ensure authorities are not empty
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        if (authorities.isEmpty()) {
            throw new BadCredentialsException("User has no assigned roles");
        }

        String token = jwtProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse();

        authResponse.setMessage("Login Success");
        authResponse.setJwt(token);

        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customUserDetails.loadUserByUsername(username);

        // Debug: Check if userDetails is loaded correctly
        if (userDetails == null) {
            System.out.println("User not found in database");
            throw new BadCredentialsException("Invalid username or password");
        }

        // Debug: Check if authorities are properly loaded
        if (userDetails.getAuthorities() == null || userDetails.getAuthorities().isEmpty()) {
            System.out.println("No authorities found for user");
            throw new BadCredentialsException("User has no assigned roles");
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            System.out.println("Password does not match");
            throw new BadCredentialsException("Invalid username or password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }


}
