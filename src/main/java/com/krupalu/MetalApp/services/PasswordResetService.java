package com.krupalu.MetalApp.services;

public interface PasswordResetService {

    public String createPasswordResetToken(String email);

    public void resetPassword(String token, String newPassword);

}
