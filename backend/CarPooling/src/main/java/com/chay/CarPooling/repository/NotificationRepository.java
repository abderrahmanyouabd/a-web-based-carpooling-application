package com.chay.CarPooling.repository;

import com.chay.CarPooling.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByRideId(Long rideId);
}
