package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.config.JwtProvider;
import com.chay.CarPooling.domain.UserRole;
import com.chay.CarPooling.model.PasswordResetToken;
import com.chay.CarPooling.model.User;
import com.chay.CarPooling.repository.PasswordResetTokenRepository;
import com.chay.CarPooling.repository.UserRepository;
import com.chay.CarPooling.request.UpdateUserDto;
import com.chay.CarPooling.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.ExpressionException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private JavaMailSender javaMailSender;


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
        User user = userRepository.findByEmail(email);
        if(user != null) {
            return user;
        }
        throw new ExpressionException("user doesn't exist with email" + email);
    }

    @Override
    public List<User> findAllUsers() {
        // TODO Auto-generated method stub
        return userRepository.findAll();
    }

    @Override
    public UserRole getUserRole(User user) {
        return null;
    }

    @Override
    public void updatePassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public void sendPasswordResetEmail(User user) {
        // Generate a random token (I might change the method I use)
        String resetToken = generateRandomToken();

        // Calculate expiry date
        Date expiryDate = calculateExpiryDate();

        // Save the stuff in db
        PasswordResetToken passwordResetToken = new PasswordResetToken(resetToken, user, expiryDate);
        passwordResetTokenRepository.save(passwordResetToken);

        // send email and provide frontend endpoint url
        sendEmail(user.getEmail(), "Password Reset", "Click the following link to reset your password: http://localhost:3000/account/reset-password?token=" + resetToken);

    }

    private void sendEmail(String to, String subject, String message) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(to);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);

        javaMailSender.send(mailMessage);

    }

    private Date calculateExpiryDate() {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.add(Calendar.MINUTE, 30);
        return cal.getTime();
    }

    private String generateRandomToken() {
        return UUID.randomUUID().toString();
    }

    @Override
    public User updateUser(UpdateUserDto dto, User user) {

        if(dto.getMobile()!=null){
            user.setMobile(dto.getMobile());
        }
        if(dto.getEmail()!=null){
            user.setEmail(dto.getEmail());
        }
        if(dto.getDateOfBirth()!=null){
            user.setDateOfBirth(dto.getDateOfBirth());
        }
        if (dto.getProfilePicture() != null && !dto.getProfilePicture().isEmpty()) {
            try {
                byte[] profilePictureBytes = dto.getProfilePicture().getBytes();
                user.setProfilePicture(profilePictureBytes);
            } catch (IOException e) {
                throw new RuntimeException("Error storing profile picture", e);
            }
        }
        if(dto.getFullName()!=null){
            user.setFullName(dto.getFullName());
        }
        if(dto.getBio()!=null){
            user.setBio(dto.getBio());
        }
        if(dto.getChatPreference()!=null){
            user.setChatPreference(dto.getChatPreference());
        }
        if(dto.getPetPreference()!=null){
            user.setPetPreference(dto.getPetPreference());
        }
        if(dto.getSmokingPreference()!=null){
            user.setSmokingPreference(dto.getSmokingPreference());
        }
        if(dto.getPlaylistPreference()!=null){
            user.setPlaylistPreference(dto.getPlaylistPreference());
        }

        return userRepository.save(user);
    }
}
