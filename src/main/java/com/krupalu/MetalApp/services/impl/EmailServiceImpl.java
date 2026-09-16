package com.krupalu.MetalApp.services.impl;

import com.krupalu.MetalApp.entity.BuyerRequest;
import com.krupalu.MetalApp.entity.ProductPost;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.enums.RequestStatus;
import com.krupalu.MetalApp.repo.BuyerRequestRepository;
import com.krupalu.MetalApp.repo.ProductPostRepository;
import com.krupalu.MetalApp.repo.UserRepository;
import com.krupalu.MetalApp.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private BuyerRequestRepository buyerRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductPostRepository productPostRepository;

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("sd.apps.co@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public void emailForBuyerOffer(String fullName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("robbystodomingo@gmail.com");
        message.setTo("weefeephotobooth@gmail.com");
        message.setSubject("Proposal to Offer My Product to Buyers");
        message.setText("Hello Admin,\n" +
                "\n" +
                "I would like to express my interest in offering my product to " + fullName + ". I would appreciate the opportunity to discuss the " +
                "requirements of the buyer and potentially selling my product.\n" +
                "\n" +
                "Thank you for your time, and I look forward to hearing from you.\n" +
                "\n");
        mailSender.send(message);
    }


    public void emailForAdvertiserOffer(String fullName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("robbystodomingo@gmail.com");
        message.setTo("weefeephotobooth@gmail.com");
        message.setSubject("Proposal to Advertise My Product");
        message.setText("Hello Admin,\n" +
                "\n" +
                "I would like to express my interest in discussing my product to be advertised to  " + fullName + ". I would appreciate the opportunity to discuss the " +
                "requirements and process for advertising my product on your platform.\n" +
                "\n" +
                "Thank you for your time, and I look forward to hearing from you.\n" +
                "\n");
        mailSender.send(message);
    }

    @Override
    public void emailForIntentToPurchase(String fullName, String id, Long productId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("robbystodomingo@gmail.com");
        message.setTo("weefeephotobooth@gmail.com");
        message.setSubject("Intent to purchase Seller's product");
        message.setText("Hello Admin,\n" +
                "\n" +
                "I would like to express my interest in discussing to purchase from " + fullName + ". I would appreciate the opportunity to discuss the " +
                "requirements and process for advertising my product on your platform.\n" +
                "\n" +
                "Thank you for your time, and I look forward to hearing from you.\n" +
                "\n");
        mailSender.send(message);

        User buyer = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found with id: " + id));

        ProductPost product = productPostRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));

        BuyerRequest request = BuyerRequest.builder()
                .buyer(buyer)
                .productPost(product)
                .status(RequestStatus.SENT)
                .build();

        buyerRequestRepository.save(request);
    }

    @Override
    public void sendTrialReminder(String email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your trial is ending soon");
        message.setText("Hi,\n\nYour trial will end in 7 days. After that, your subscription will continue automatically.\n\nIf you’d like to make changes, please visit your account settings.\n\nThanks,\nKrupalu Metal Inc.");
        mailSender.send(message);
    }

}
