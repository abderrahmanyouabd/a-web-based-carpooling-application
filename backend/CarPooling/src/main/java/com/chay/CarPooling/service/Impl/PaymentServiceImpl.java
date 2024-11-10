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

//    @Override
//    public PaymentIntent createPaymentIntent(BigDecimal amount, String currency, Long userId, Long tripId) throws StripeException {
//        // Create payment intent with Stripe
//        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
//                .setAmount(amount.multiply(BigDecimal.valueOf(100)).longValue()) // Stripe amount in cents
//                .setCurrency(currency)
//                .build();
//        PaymentIntent paymentIntent = PaymentIntent.create(params);
//
//        // Save transaction in database
//        PaymentTransaction transaction = new PaymentTransaction();
//        transaction.setPaymentIntentId(paymentIntent.getId());
//        transaction.setUserId(userId);
//        transaction.setTripId(tripId);
//        transaction.setAmount(amount);
//        transaction.setCurrency(currency);
//        transaction.setStatus("pending");
//        paymentTransactionRepository.save(transaction);
//
//        return paymentIntent;
//    }

//    @Override
//    public PaymentIntent createPaymentIntent(BigDecimal amount, String currency, Long userId, Long tripId) throws StripeException {
//        BigDecimal adjustedAmount = amount;
//
//        // Adjust amount based on currency
//        if (currency.equalsIgnoreCase("HUF")) {
//            adjustedAmount = amount.multiply(BigDecimal.valueOf(100)); // Convert to fillér for HUF
//            if (adjustedAmount.compareTo(new BigDecimal("17500")) < 0) { // Minimum 175 HUF
//                throw new IllegalArgumentException("Amount must be at least 175 HUF (or 17500 fillér) for HUF transactions.");
//            }
//        } else if (currency.equalsIgnoreCase("USD")) {
//            adjustedAmount = amount.multiply(BigDecimal.valueOf(100)); // Convert to cents for USD
//            if (adjustedAmount.compareTo(new BigDecimal("50")) < 0) { // Minimum 0.50 USD
//                throw new IllegalArgumentException("Amount must be at least $0.50 (or 50 cents) for USD transactions.");
//            }
//        }
//        // Add additional currency handling if needed
//
//        // Create payment intent with Stripe
//        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
//                .setAmount(adjustedAmount.longValue()) // Stripe amount in the smallest currency unit
//                .setCurrency(currency)
//                .build();
//        PaymentIntent paymentIntent = PaymentIntent.create(params);
//
//        // Save transaction in the database
//        PaymentTransaction transaction = new PaymentTransaction();
//        transaction.setPaymentIntentId(paymentIntent.getId());
//        transaction.setUserId(userId);
//        transaction.setTripId(tripId);
//        transaction.setAmount(amount);
//        transaction.setCurrency(currency);
//        transaction.setStatus("pending");
//        paymentTransactionRepository.save(transaction);
//
//        return paymentIntent;
//    }

    @Override
    public PaymentIntent createPaymentIntent(BigDecimal amount, String currency, Long userId, Long tripId) throws StripeException {
        BigDecimal adjustedAmount = BigDecimal.ZERO;

        if (currency.equalsIgnoreCase("HUF")) {
            adjustedAmount = new BigDecimal("2000");
        } else if (currency.equalsIgnoreCase("USD")) {
            adjustedAmount = new BigDecimal("1.00");
        }


        System.out.println("Adjusted Amount for " + currency + ": " + adjustedAmount);


        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(adjustedAmount.multiply(BigDecimal.valueOf(100)).longValue())
                .setCurrency(currency)
                .build();
        PaymentIntent paymentIntent = PaymentIntent.create(params);

        PaymentTransaction transaction = new PaymentTransaction(
                paymentIntent.getId(),
                userId,
                tripId,
                amount,
                currency,
                "pending"
        );
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
        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setUserId(userId);
        transaction.setTripId(tripId);
        transaction.setAmount(amount);
        transaction.setPaymentIntentId(paymentIntentId);
        transaction.setCreatedAt(LocalDateTime.now());


        paymentTransactionRepository.save(transaction);
    }
}
