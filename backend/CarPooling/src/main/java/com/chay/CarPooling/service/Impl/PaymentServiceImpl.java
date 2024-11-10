package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.model.PaymentTransaction;
import com.chay.CarPooling.repository.PaymentTransactionRepository;
import com.chay.CarPooling.service.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentTransactionRepository paymentTransactionRepository;

    @Override
    public PaymentIntent createPaymentIntent(BigDecimal amount, String currency, Long userId, Long tripId) throws StripeException {
        // Create payment intent with Stripe
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount.multiply(BigDecimal.valueOf(100)).longValue()) // Stripe amount in cents
                .setCurrency(currency)
                .build();
        PaymentIntent paymentIntent = PaymentIntent.create(params);

        // Save transaction in database
        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setPaymentIntentId(paymentIntent.getId());
        transaction.setUserId(userId);
        transaction.setTripId(tripId);
        transaction.setAmount(amount);
        transaction.setCurrency(currency);
        transaction.setStatus("pending");
        paymentTransactionRepository.save(transaction);

        return paymentIntent;
    }

    @Override
    public void updateTransactionStatus(String paymentIntentId, String status) {
        PaymentTransaction transaction = paymentTransactionRepository.findByPaymentIntentId(paymentIntentId);
        if (transaction != null) {
            transaction.setStatus(status);
            paymentTransactionRepository.save(transaction);
        }
    }

    @Override
    public void logPaymentTransaction(Long userId, Long tripId, BigDecimal amount, String paymentIntentId) {
        // Save the transaction to the database, e.g., using a PaymentTransactionRepository
        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setUserId(userId);
        transaction.setTripId(tripId);
        transaction.setAmount(amount);
        transaction.setPaymentIntentId(paymentIntentId);
        transaction.setCreatedAt(LocalDateTime.now());


        paymentTransactionRepository.save(transaction);
    }
}
