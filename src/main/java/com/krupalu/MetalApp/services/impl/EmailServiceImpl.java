package com.krupalu.MetalApp.services.impl;

import com.krupalu.MetalApp.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {
    @Autowired
    private JavaMailSender mailSender;

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
                "I would like to express my interest in offering my product to Mr./Ms. " + fullName + ". I would appreciate the opportunity to discuss the " +
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
                "I would like to express my interest in discussing my product to be advertised to Mr./Ms. " + fullName + ". I would appreciate the opportunity to discuss the " +
                "requirements and process for advertising my product on your platform.\n" +
                "\n" +
                "Thank you for your time, and I look forward to hearing from you.\n" +
                "\n");
        mailSender.send(message);
    }

}
