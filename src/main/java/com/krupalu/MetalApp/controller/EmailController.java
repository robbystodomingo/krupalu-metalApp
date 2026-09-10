package com.krupalu.MetalApp.controller;

import com.krupalu.MetalApp.dto.EmailRequest;
import com.krupalu.MetalApp.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public String sendEmail(@RequestBody EmailRequest request) {
        emailService.sendEmail(request.getTo(), request.getSubject(), request.getBody());
        return "Email sent successfully to " + request.getTo();
    }

    @PostMapping("/offerBuyer")
    public String emailForBuyerOffer(@RequestParam String fullName) {
        emailService.emailForBuyerOffer(fullName);
        return "Email sent to Admin to offer my product to: " + fullName;
    }

    @PostMapping("/offerAdvertiser")
    public String emailForAdvertiserOffer(@RequestParam String fullName) {
        emailService.emailForAdvertiserOffer(fullName);
        return "Email sent to Admin to discuss my product to: " + fullName;
    }

    @PostMapping("/intentToPurchase")
    public String emailForIntentToPurchase(@RequestParam String fullName) {
        emailService.emailForIntentToPurchase(fullName);
        return "Email sent to Admin to discuss my intent to purchase product's from: " + fullName;
    }


}
