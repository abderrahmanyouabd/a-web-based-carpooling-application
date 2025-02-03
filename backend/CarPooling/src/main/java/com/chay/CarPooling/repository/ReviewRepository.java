package com.chay.CarPooling.repository;

import com.chay.CarPooling.model.Review;
import com.chay.CarPooling.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUserOrderByCreatedAtDesc(User user);
    
    @Query("SELECT AVG(CAST(r.rating AS double)) FROM Review r WHERE r.user = ?1")
    Double getAverageRatingForUser(User user);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.user = ?1")
    Integer getReviewCountForUser(User user);

    boolean existsByUserAndReviewer(User user, User reviewer);
} 