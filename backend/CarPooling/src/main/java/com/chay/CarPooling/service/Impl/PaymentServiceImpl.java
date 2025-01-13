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
