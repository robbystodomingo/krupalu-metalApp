package com.krupalu.MetalApp.services;

public interface EmailService {

    public void sendEmail(String to, String subject, String body);

    public void emailForBuyerOffer(String fullName);

    public void emailForAdvertiserOffer(String fullName);

    public void emailForIntentToPurchase(String fullName);

    public void sendTrialReminder(String email);
}
