package com.krupalu.MetalApp.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${stripe.price.id}")
    private String stripePriceId;

    @Value("${stripe.currency}")
    private String stripeCurrency;

    @PostConstruct
    public void init(){
        Stripe.apiKey = stripeSecretKey;
    }

    public String getPriceId() {
        return stripePriceId;
    }

    public String getCurrency() {
        return stripeCurrency;
    }

}
