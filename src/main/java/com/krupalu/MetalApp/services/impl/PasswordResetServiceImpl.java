package com.krupalu.MetalApp.services.impl;

import com.krupalu.MetalApp.entity.PasswordResetToken;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.repo.PasswordResetTokenRepository;
import com.krupalu.MetalApp.repo.UserRepository;
import com.krupalu.MetalApp.services.PasswordResetService;
import com.krupalu.MetalApp.util.OtpGenerator;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    public String createPasswordResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        String otp = OtpGenerator.generateOtp(6);
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(otp)
                .userId(user.getId())
                .expiryDate(LocalDateTime.now().plusHours(1))
                .build();

        tokenRepository.save(resetToken);

        String htmlContent = """
        <html>
          <body style="font-family: Arial, sans-serif; line-height:1.6;">
            <h2 style="color:#2c3e50;">Password Reset Code</h2>
            <p>Hello %s,</p>
            <p>You requested to reset your password. Use the code below:</p>
            <h1 style="letter-spacing:4px; color:#007bff;">%s</h1>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
            <hr/>
            <small>&copy; 2026 Krupalu Metal Inc</small>
          </body>
        </html>
    """.formatted(user.getFullName(), otp);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);
            helper.setSubject("Password Reset OTP");
            helper.setText(htmlContent, true); // true = HTML

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password reset email", e);
        }

        return otp; // 👈 return token so controller can use it if needed
    }

    public void resetPassword(String otp, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(otp)
                .orElseThrow(() -> new IllegalArgumentException("Invalid OTP"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP expired");
        }

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken); // invalidate OTP
    }
}
