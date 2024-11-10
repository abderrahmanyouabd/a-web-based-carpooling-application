package com.chay.CarPooling.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;


/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Entity
@Data
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paymentIntentId; // Unique ID from Stripe
    private Long userId;            // Reference to User ID
    private Long tripId;            // Reference to Trip ID
    private BigDecimal amount;      // Amount charged
    private String currency;        // e.g., "USD"
    private String status;          // e.g., "pending", "succeeded", "failed"

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}