package com.chay.CarPooling.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;


/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Entity
@Data
@NoArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "tripId"}))
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paymentIntentId;
    private Long userId;
    private Long tripId;
    private BigDecimal amount;
    private String currency;
    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PaymentTransaction(String paymentIntentId, Long userId, Long tripId, BigDecimal amount, String currency, String status) {
        this.paymentIntentId = paymentIntentId;
        this.userId = userId;
        this.tripId = tripId;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
    }


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }


    public PaymentTransaction(String id, Long id1, Long tripId, String status) {
        this.paymentIntentId = id;
        this.userId = id1;
        this.tripId = tripId;
        this.status = status;

    }
}