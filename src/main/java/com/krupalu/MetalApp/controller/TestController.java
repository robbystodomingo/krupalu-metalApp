package com.krupalu.MetalApp.controller;


import com.krupalu.MetalApp.services.KrupSubcriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
public class TestController {

    @Autowired
    private  KrupSubcriptionService subscriptionService;

    @PostMapping("/start-subscription")
    public String startSubscription(@RequestParam String customerId,
                                    @RequestParam String priceId,
                                    @RequestParam String currencyId) {
        try {
            subscriptionService.startSubscription(customerId);
            return "Subscription created for customer " + customerId;
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    @PostMapping("/start-subscription-delayed")
    public String startSubscriptionDelayed(@RequestParam String customerId,
                                    @RequestParam String priceId,
                                    @RequestParam String currencyId) {
        try {
            subscriptionService.startSubscriptionDelayed(customerId, priceId, currencyId);
            return "Subscription created for customer " + customerId;
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }



}
