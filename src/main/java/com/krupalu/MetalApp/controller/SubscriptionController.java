package com.krupalu.MetalApp.controller;

import com.krupalu.MetalApp.dto.SetupIntentResponse;
import com.krupalu.MetalApp.services.KrupSubcriptionService;
import com.stripe.exception.StripeException;
import com.stripe.model.SetupIntent;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.quartz.SchedulerException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/subscription")
@RequiredArgsConstructor
@CrossOrigin()
public class SubscriptionController {

    private final KrupSubcriptionService krupSubcriptionService;


    @PostMapping("/registerPaymentMethod")
    public ResponseEntity<SetupIntentResponse> savePaymentMethod(@RequestParam String email) throws StripeException, SchedulerException {
        return ResponseEntity.ok(krupSubcriptionService.savePaymentMethod(email));
    }

}
