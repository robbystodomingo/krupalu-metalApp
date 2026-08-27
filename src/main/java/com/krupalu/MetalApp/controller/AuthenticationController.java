package com.krupalu.MetalApp.controller;


import com.krupalu.MetalApp.dto.JWTAuthenticationResponse;
import com.krupalu.MetalApp.dto.RefreshTokenRequest;
import com.krupalu.MetalApp.dto.SignInRequest;
import com.krupalu.MetalApp.dto.RegistrationRequest;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.services.AuthenticationService;
import com.krupalu.MetalApp.services.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin()
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    private final JWTService jwtService;

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
}
