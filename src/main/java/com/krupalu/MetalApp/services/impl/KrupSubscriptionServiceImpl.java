package com.krupalu.MetalApp.services.impl;

import com.krupalu.MetalApp.config.StripeConfig;
import com.krupalu.MetalApp.dto.SetupIntentResponse;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.repo.UserRepository;
import com.krupalu.MetalApp.services.KrupSubcriptionService;
import com.krupalu.MetalApp.util.SubscriptionJob;
import com.krupalu.MetalApp.util.SubscriptionScheduler;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.net.ApiResource;
import com.stripe.net.RequestOptions;
import com.stripe.param.*;
import com.stripe.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.quartz.JobExecutionException;
import org.quartz.SchedulerException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class KrupSubscriptionServiceImpl implements KrupSubcriptionService {

    private JavaMailSender mailSender;

    private static final Logger logger = Logger.getLogger(SubscriptionJob.class.getName());
    private final SubscriptionScheduler subscriptionScheduler;

    private final SubscriptionJob subscriptionJob;

    private final StripeConfig stripeConfig;

    private final UserRepository userRepository;

    @Override
    public SetupIntentResponse savePaymentMethod(String email) throws StripeException, SchedulerException {

        String customerId = findOrCreateCustomer(email);

        SetupIntentCreateParams params = SetupIntentCreateParams.builder()
                .setCustomer(customerId)
                .addPaymentMethodType("card")
                .build();

        SetupIntent setupIntent = SetupIntent.create(params);

        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            Subscription subscription;

            if (!user.isTrialUsed()) {
                // ✅ First time → create subscription with trial
                long trialEndEpoch = LocalDateTime.now()
                        .plusMonths(6)
                        .atZone(ZoneId.systemDefault())
                        .toEpochSecond();

                SubscriptionCreateParams subscriptionParams = SubscriptionCreateParams.builder()
                        .setCustomer(customerId)
                        .addItem(
                                SubscriptionCreateParams.Item.builder()
                                        .setPrice(stripeConfig.getPriceId())
                                        .build()
                        )
                        .setCurrency(stripeConfig.getCurrency())
                        .setTrialEnd(trialEndEpoch)
                        .setDefaultPaymentMethod(setupIntent.getPaymentMethod())
                        .build();

                subscription = Subscription.create(subscriptionParams);
                logger.info("Subscription created with trial until: " + trialEndEpoch);

                // ✅ Persist subscription ID and trial flag
                user.setTrialUsed(true);
                user.setStripeSubscriptionId(subscription.getId());
                userRepository.save(user);

            } else {
                // ✅ Subsequent times → update payment method only
                PaymentMethod pm = PaymentMethod.retrieve(setupIntent.getPaymentMethod());
                pm.attach(PaymentMethodAttachParams.builder().setCustomer(customerId).build());

                subscription = Subscription.retrieve(user.getStripeSubscriptionId());

                SubscriptionUpdateParams updateParams = SubscriptionUpdateParams.builder()
                        .setDefaultPaymentMethod(pm.getId())
                        .build();

                subscription.update(updateParams);
                logger.info("Updated subscription with new payment method: " + pm.getId());
            }

        } catch (Exception e) {
            logger.severe("Failed to start or update subscription: " + e.getMessage());
            throw new JobExecutionException("Failed to start or update subscription", e);
        }

        return new SetupIntentResponse(
                setupIntent.getId(),
                setupIntent.getClientSecret(),
                setupIntent.getStatus(),
                customerId
        );
    }


    private String findOrCreateCustomer(String email) throws StripeException {
        CustomerListParams listParams = CustomerListParams.builder()
                .setEmail(email)
                .setLimit(1L)
                .build();

        CustomerCollection existing = Customer.list(listParams);
        if (!existing.getData().isEmpty()) {
            return existing.getData().get(0).getId();
        }

        CustomerCreateParams createParams = CustomerCreateParams.builder()
                .setEmail(email)
                .build();

        Customer created = Customer.create(createParams);
        return created.getId();
    }

    @Override
    public void startSubscription(String customerId) throws JobExecutionException {
        long trialEndEpoch = LocalDateTime.now()
                .plusMonths(6)
                .atZone(ZoneId.systemDefault())
                .toEpochSecond();
        try {

            PaymentMethod pm = subscriptionJob.getDefaultPaymentMethod(customerId);
            SubscriptionCreateParams params = SubscriptionCreateParams.builder()
                    .addItem(
                            SubscriptionCreateParams.Item.builder()
                                    .setPrice(stripeConfig.getPriceId())
                                    .build()
                    )
                    .setCurrency(stripeConfig.getCurrency())
                    .setCustomer(customerId)
                    .setDefaultPaymentMethod(pm.getId())
                    .setTrialEnd(trialEndEpoch)
                    .build();
            Subscription subscription = Subscription.create(params);
            logger.info("Charge successful: " + subscription.getId());
        } catch (Exception e) {
            logger.severe("Failed to start subscription: " + e.getMessage());
            throw new JobExecutionException("Failed to start subscription", e);
        }
    }

    public Subscription startSubscriptionDelayed(String customerId, String priceId, String paymentMethodId) throws StripeException {
        // Calculate trial end timestamp (6 months from now)
        LocalDateTime trialEndDate = LocalDateTime.now().plusMonths(6);
        long trialEndEpoch = trialEndDate.atZone(ZoneId.systemDefault()).toEpochSecond();

        SubscriptionCreateParams params = SubscriptionCreateParams.builder()
                .setCustomer(customerId)
                .addItem(
                        SubscriptionCreateParams.Item.builder()
                                .setPrice(priceId)
                                .build()
                )
                .setDefaultPaymentMethod(paymentMethodId)
                .setTrialEnd(trialEndEpoch) // Stripe expects seconds since epoch
                .build();

        Subscription subscription = Subscription.create(params);
        System.out.println("Subscription created: " + subscription.getId());
        return subscription;
    }


    public Invoice checkUpcomingInvoice(String customerId, String subscriptionId) {

        // Build typed params instead of Map
        InvoiceCreatePreviewParams params = InvoiceCreatePreviewParams.builder()
                .setCustomer(customerId)
                .setSubscription(subscriptionId)
                .build();

        // Construct InvoiceService with the default response getter
        InvoiceService invoiceService = new InvoiceService(ApiResource.getGlobalResponseGetter());

        try {
            Invoice upcoming = invoiceService.createPreview(params, RequestOptions.getDefault());

            System.out.println("Next payment attempt: " + upcoming.getNextPaymentAttempt());
            System.out.println("Amount due: " + upcoming.getAmountDue());

            return upcoming;
        } catch (StripeException e) {
            System.err.println("Failed to fetch upcoming invoice: " + e.getMessage());
            return null;
        }
    }

    /**
     * Retrieve subscription details (status, period, etc.)
     */
    public Subscription getSubscription(String subscriptionId) throws StripeException {
        return Subscription.retrieve(subscriptionId);
    }


}
