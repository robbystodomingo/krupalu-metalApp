package com.krupalu.MetalApp.services;

import com.krupalu.MetalApp.dto.SetupIntentResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentMethod;
import com.stripe.model.SetupIntent;
import com.stripe.model.Subscription;
import org.quartz.JobExecutionException;
import org.quartz.SchedulerException;

public interface KrupSubcriptionService {

    public SetupIntentResponse savePaymentMethod(String email) throws StripeException, SchedulerException;

    public void startSubscription(String customerId) throws JobExecutionException;

    public Subscription startSubscriptionDelayed(String customerId, String priceId, String paymentMethodId) throws StripeException;

}
