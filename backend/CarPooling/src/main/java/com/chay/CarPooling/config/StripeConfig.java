package com.chay.CarPooling.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

@Configuration
public class StripeConfig {

    @Value("${stripe.api.key}")
    private String apikey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = apikey;
    }
}

