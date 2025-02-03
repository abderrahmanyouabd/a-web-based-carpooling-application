package com.chay.CarPooling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserReviewSummaryDTO {
    private String driverName;
    private Double averageRating;
    private Integer totalReviews;
} 