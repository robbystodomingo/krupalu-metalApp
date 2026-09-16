package com.krupalu.MetalApp.controller;


import com.krupalu.MetalApp.config.LogoutService;
import com.krupalu.MetalApp.dto.JWTAuthenticationResponse;
import com.krupalu.MetalApp.dto.RefreshTokenRequest;
import com.krupalu.MetalApp.dto.SignInRequest;
import com.krupalu.MetalApp.dto.RegistrationRequest;
import com.krupalu.MetalApp.entity.PasswordResetToken;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.repo.PasswordResetTokenRepository;
import com.krupalu.MetalApp.services.AuthenticationService;
import com.krupalu.MetalApp.services.JWTService;
import com.krupalu.MetalApp.services.PasswordResetService;
import com.krupalu.MetalApp.services.UserService;
import com.krupalu.MetalApp.token.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin()
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    private final JWTService jwtService;

    private final LogoutService logoutService;

    private final UserService userService;

    private final PasswordResetService passwordResetService;

    // Make sure this is the same repository you used to save the OTP
    private final PasswordResetTokenRepository tokenRepository;


    @PostMapping("/register")
    public ResponseEntity<JWTAuthenticationResponse> registration(@Valid @RequestBody RegistrationRequest registrationRequest){
        return ResponseEntity.ok(authenticationService.registration(registrationRequest));
    }

    @PostMapping("/signin")
    public ResponseEntity<JWTAuthenticationResponse> signin(@RequestBody SignInRequest signInRequest){
        return ResponseEntity.ok(authenticationService.signin(signInRequest));
    }

    @PostMapping("/refresh")
    public ResponseEntity<JWTAuthenticationResponse> refresh(@RequestBody RefreshTokenRequest refreshTokenRequest){
    return ResponseEntity.ok(authenticationService.refreshToken(refreshTokenRequest));
}



    @GetMapping("/profile")
    public ResponseEntity<String> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok("Hello " + user.getFullName() + ", your email is " + user.getUsername());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        logoutService.logout(request, response, authentication);
        return ResponseEntity.ok("You have been logged out successfully.");
    }

    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        boolean exists = userService.userExists(email);
        return ResponseEntity.ok(exists);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            String token = passwordResetService.createPasswordResetToken(email);
            // In production: send token via email link
            return ResponseEntity.ok("Password reset link sent. Token: " + token);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token,
                                           @RequestParam String newPassword) {
        try {
            passwordResetService.resetPassword(token, newPassword);
            return ResponseEntity.ok("Password reset successful");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/validate-otp")
    public ResponseEntity<?> validateOtp(@RequestParam String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid OTP"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("OTP expired");
        }

        return ResponseEntity.ok("OTP valid");
    }

}
