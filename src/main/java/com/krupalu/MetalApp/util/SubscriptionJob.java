package com.krupalu.MetalApp.util;

import com.krupalu.MetalApp.services.KrupSubcriptionService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentMethod;
import com.stripe.model.Subscription;
import com.stripe.param.PaymentMethodListParams;
import com.stripe.param.SubscriptionCreateParams;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.logging.Logger;

public class SubscriptionJob implements Job {

    private static final Logger logger = Logger.getLogger(SubscriptionJob.class.getName());



    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        logger.info("Job started");
        String customerId = context.getMergedJobDataMap().getString("customerId");
        String priceId = context.getMergedJobDataMap().getString("priceId");

        try {
            // Fetch the customer's default payment method at runtime
            PaymentMethod pm = getDefaultPaymentMethod(customerId);

            // Calculate trial end timestamp (6 months from now)
            /*LocalDateTime trialEndDate = LocalDateTime.now().plusMonths(6);
            long trialEndEpoch = LocalDateTime.now()
                    .plusMonths(6)
                    .atZone(ZoneId.systemDefault())
                    .toEpochSecond();*/


            SubscriptionCreateParams params = SubscriptionCreateParams.builder()
                    .setCustomer(customerId)
                    .addItem(
                            SubscriptionCreateParams.Item.builder()
                                    .setPrice(priceId)
                                    .build()
                    )
                    .setDefaultPaymentMethod(pm.getId())
                    /*.setTrialEnd(trialEndEpoch) // Stripe expects seconds since epoch*/
                    .build();

            logger.info("Creating subscription with params: " + params.toString());
            try {
                Subscription subscription = Subscription.create(params);
                logger.info("Stripe API key: " + Stripe.apiKey);
                logger.info("Stripe response: " + subscription.toJson());
                System.out.println("Subscription created: " + subscription.getId());
            } catch (StripeException se) {
                logger.severe("Stripe API error: " + se.getMessage());
            }




        } catch (Exception e) {
            throw new JobExecutionException("Failed to start subscription", e);
        }
    }

    public PaymentMethod getDefaultPaymentMethod(String customerId) throws StripeException {
        Customer customer = Customer.retrieve(customerId);

        if (customer.getInvoiceSettings() != null &&
                customer.getInvoiceSettings().getDefaultPaymentMethod() != null) {
            return PaymentMethod.retrieve(customer.getInvoiceSettings().getDefaultPaymentMethod());
        }

        // fallback: first attached card
        PaymentMethodListParams params = PaymentMethodListParams.builder()
                .setCustomer(customerId)
                .setType(PaymentMethodListParams.Type.CARD)
                .build();

        return PaymentMethod.list(params).getData().get(0);
    }



}
