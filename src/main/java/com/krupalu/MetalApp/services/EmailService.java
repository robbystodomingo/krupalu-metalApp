package com.krupalu.MetalApp.services;

public interface EmailService {

    public void sendEmail(String to, String subject, String body);

    public void emailForBuyerOffer(String fullName);

    public void emailForAdvertiserOffer(String fullName);

    public void emailForIntentToPurchase(String fullName, String id, Long productId);

    public void sendTrialReminder(String email);

    public void sendApprovalEmail(String to, String fullName, String role);

    public void sendRejectionEmail(String to, String fullName, String role);

    public void sendRequirementEditedEmail(String to, String fullName, String role);

    public void sendProductPostingApproval(String to, String fullName, String role);

    public void sendAdvertisementPostingApproval(String to, String fullName, String role);

    public void sendProductPostingRejection(String to, String fullName, String role);

    public void sendAdvertisementPostingRejection(String to, String fullName, String role);
}
