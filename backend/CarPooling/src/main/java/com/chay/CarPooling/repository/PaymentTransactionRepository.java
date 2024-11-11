package com.chay.CarPooling.repository;

import com.chay.CarPooling.model.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    PaymentTransaction findByPaymentIntentId(String paymentIntentId);
    PaymentTransaction findByUserIdAndTripId(Long userId, Long tripId);
}
