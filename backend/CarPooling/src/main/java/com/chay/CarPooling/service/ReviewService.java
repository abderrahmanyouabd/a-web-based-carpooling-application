package com.chay.CarPooling.service;

import com.chay.CarPooling.dto.ReviewDTO;
import com.chay.CarPooling.dto.UserReviewSummaryDTO;
import java.util.List;

public interface ReviewService {
    ReviewDTO createReview(Long userId, String jwt, ReviewDTO reviewDTO);
    List<ReviewDTO> getUserReviews(Long userId);
    UserReviewSummaryDTO getUserReviewSummary(Long userId);
} 