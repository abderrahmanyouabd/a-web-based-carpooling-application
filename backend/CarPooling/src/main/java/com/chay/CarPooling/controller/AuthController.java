package com.chay.CarPooling.controller;

import com.chay.CarPooling.config.JwtProvider;
import com.chay.CarPooling.domain.Gender;
import com.chay.CarPooling.domain.UserRole;
import com.chay.CarPooling.model.PasswordResetToken;
import com.chay.CarPooling.model.Trip;
import com.chay.CarPooling.model.User;
import com.chay.CarPooling.repository.UserRepository;
import com.chay.CarPooling.request.LoginRequest;
import com.chay.CarPooling.request.ResetPasswordRequest;
import com.chay.CarPooling.response.ApiResponse;
import com.chay.CarPooling.response.AuthResponse;
import com.chay.CarPooling.service.FareCalculationService;
import com.chay.CarPooling.service.Impl.CustomeUserServiceImplementation;
import com.chay.CarPooling.service.PasswordResetTokenService;
import com.chay.CarPooling.service.TrackingService;
import com.chay.CarPooling.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.ExpressionException;
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
import org.springframework.web.bind.annotation.*;

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
    private final UserService userService;
    private final PasswordResetTokenService passwordResetTokenService;
    private final TrackingService trackingService;


    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user){

        String email = user.getEmail();
        String password = user.getPassword();
        String fullName = user.getFullName();
        String dateOfBirth = user.getDateOfBirth();
        Gender gender = user.getGender();
        String clientIp = user.getCurrentIpAddress();


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
        createdUser.setDateOfBirth(dateOfBirth);
        createdUser.setRole(UserRole.USER_ROLE);
        createdUser.setGender(gender);
        createdUser.setStatus(true);

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
    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
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

        String clientIp = trackingService.getClientIp(request);

        // todo: if last ip is not equal to current ip, send email to user saying that someone logged in to his account, is it you? if not change password.
        User user = userRepository.findByEmail(username);
        user.setCurrentIpAddress(clientIp);
        userRepository.save(user);
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


    // todo RequestParam instead of RequestBody
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody ResetPasswordRequest req) throws Exception {
        PasswordResetToken resetToken = passwordResetTokenService.findByToken(req.getToken());
        if (resetToken == null) {
            throw new ExpressionException("token is required");
        }
        if(resetToken.isExpired()){
            passwordResetTokenService.delete(resetToken);
            throw new ExpressionException("token got expired");
        }


        User user = resetToken.getUser();
        userService.updatePassword(user, req.getPassword());

        // todo: delete token
        passwordResetTokenService.delete(resetToken);

        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Password Reset Success");
        apiResponse.setStatus(true);

        return ResponseEntity.ok(apiResponse);
    }



//    @PostMapping("/calculate")
//    public ResponseEntity<Double> calculateFare(@RequestBody Trip trip) {
//        return  new ResponseEntity<>(fareCalculationService.calculateFare(trip), HttpStatus.OK);
//    }
//
//
//    @PostMapping("reset-password-request")
//    public ResponseEntity<ApiResponse> resetPassword(@RequestParam("email") String email) throws Exception {
//        User user = userService.findUserByEmail(email);
//
//        if(user == null){
//            throw new ExpressionException("User not found");
//        }
//
//        userService.sendPasswordResetEmail(user);
//
//        ApiResponse apiResponse = new ApiResponse();
//        apiResponse.setMessage("Password Reset email set successfully");
//        apiResponse.setStatus(true);
//        return ResponseEntity.ok(apiResponse);
//    }



}
