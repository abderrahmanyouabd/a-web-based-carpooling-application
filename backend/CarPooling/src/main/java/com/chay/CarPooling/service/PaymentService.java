package com.chay.CarPooling.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

import java.math.BigDecimal;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

public interface PaymentService {
    PaymentIntent createPaymentIntent(BigDecimal amount, String currency, Long userId, Long tripId) throws StripeException;
    void updateTransactionStatus(String paymentIntentId, String status);
    void logPaymentTransaction(Long userId, Long tripId, BigDecimal amount, String paymentIntentId);
}
