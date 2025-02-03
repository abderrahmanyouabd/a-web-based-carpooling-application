package com.chay.CarPooling.controller;

import com.chay.CarPooling.dto.ReviewDTO;
import com.chay.CarPooling.dto.UserReviewSummaryDTO;
import com.chay.CarPooling.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/users/{userId}")
    public ResponseEntity<ReviewDTO> createReview(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String jwt,
            @Valid @RequestBody ReviewDTO reviewDTO) {
        return ResponseEntity.ok(reviewService.createReview(userId, jwt, reviewDTO));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<ReviewDTO>> getUserReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getUserReviews(userId));
    }

    @GetMapping("/users/{userId}/summary")
    public ResponseEntity<UserReviewSummaryDTO> getUserReviewSummary(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getUserReviewSummary(userId));
    }
} 