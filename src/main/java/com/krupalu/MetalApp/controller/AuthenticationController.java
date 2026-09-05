package com.krupalu.MetalApp.controller;


import com.krupalu.MetalApp.config.LogoutService;
import com.krupalu.MetalApp.dto.JWTAuthenticationResponse;
import com.krupalu.MetalApp.dto.RefreshTokenRequest;
import com.krupalu.MetalApp.dto.SignInRequest;
import com.krupalu.MetalApp.dto.RegistrationRequest;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.services.AuthenticationService;
import com.krupalu.MetalApp.services.JWTService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin()
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    private final JWTService jwtService;

    private final LogoutService logoutService;

    @PostMapping("/register")
    public ResponseEntity<JWTAuthenticationResponse> registration(@RequestBody RegistrationRequest registrationRequest){
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
}
