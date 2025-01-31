package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.dto.ReviewDTO;
import com.chay.CarPooling.dto.UserReviewSummaryDTO;
import com.chay.CarPooling.model.Review;
import com.chay.CarPooling.model.User;
import com.chay.CarPooling.repository.ReviewRepository;
import com.chay.CarPooling.repository.UserRepository;
import com.chay.CarPooling.service.ReviewService;
import com.chay.CarPooling.service.UserService;
import com.chay.CarPooling.exception.InvalidRatingException;
import com.chay.CarPooling.exception.DuplicateReviewException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Override
    @Transactional
    public ReviewDTO createReview(Long userId, String jwt, ReviewDTO reviewDTO) {
        validateRating(reviewDTO.getRating());
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        
        User reviewer = userService.findUserProfileByJwt(jwt);

        if (user.getId().equals(reviewer.getId())) {
            throw new InvalidRatingException("You cannot review yourself");
        }

        if (reviewRepository.existsByUserAndReviewer(user, reviewer)) {
            throw new DuplicateReviewException("You have already reviewed this user");
        }

        Review review = new Review();
        review.setComment(reviewDTO.getComment());
        review.setRating(reviewDTO.getRating());
        review.setUser(user);
        review.setReviewer(reviewer);

        review = reviewRepository.save(review);
        
        updateUserRatingStats(user);

        return convertToDTO(review);
    }

    @Override
    public List<ReviewDTO> getUserReviews(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        
        return reviewRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserReviewSummaryDTO getUserReviewSummary(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        return new UserReviewSummaryDTO(
                user.getFullName(),
                user.getAverageRating(),
                user.getTotalReviews()
        );
    }

    private ReviewDTO convertToDTO(Review review) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d, yyyy");
        return new ReviewDTO(
                review.getId(),
                review.getReviewer().getFullName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt().format(formatter)
        );
    }

    @Transactional
    protected void updateUserRatingStats(User user) {
        Double averageRating = reviewRepository.getAverageRatingForUser(user);
        Integer totalReviews = reviewRepository.getReviewCountForUser(user);
        
        user.setAverageRating(averageRating != null ? averageRating : 0.0);
        user.setTotalReviews(totalReviews != null ? totalReviews : 0);
        userRepository.save(user);
    }

    private void validateRating(Integer rating) {
        if (rating == null) {
            throw new InvalidRatingException("Rating cannot be null");
        }
        if (rating < 1 || rating > 5) {
            throw new InvalidRatingException("Rating must be between 1 and 5");
        }
        if (rating.doubleValue() != rating.intValue()) {
            throw new InvalidRatingException("Rating must be a whole number");
        }
    }
} 