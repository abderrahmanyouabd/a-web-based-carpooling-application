package com.chay.CarPooling.repository;

import com.chay.CarPooling.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String username);
}
