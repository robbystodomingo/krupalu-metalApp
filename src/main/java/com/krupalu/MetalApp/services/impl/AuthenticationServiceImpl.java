package com.krupalu.MetalApp.services.impl;

import com.krupalu.MetalApp.dto.JWTAuthenticationResponse;
import com.krupalu.MetalApp.dto.RefreshTokenRequest;
import com.krupalu.MetalApp.dto.SignInRequest;
import com.krupalu.MetalApp.dto.RegistrationRequest;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.enums.ApprovalStatus;
import com.krupalu.MetalApp.enums.Role;
import com.krupalu.MetalApp.repo.UserRepository;
import com.krupalu.MetalApp.services.AuthenticationService;
import com.krupalu.MetalApp.services.JWTService;
import com.krupalu.MetalApp.services.UserService;
import com.krupalu.MetalApp.token.Token;
import com.krupalu.MetalApp.token.TokenRepository;
import com.krupalu.MetalApp.token.TokenType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JWTService jwtService;

    private final TokenRepository tokenRepository;

    private final UserService userService;


    public JWTAuthenticationResponse registration(RegistrationRequest registrationRequest) {

        // Look for existing user first
        var existingUserOpt = userRepository.findByEmail(registrationRequest.getEmail());

        User user;
        if (existingUserOpt.isPresent()) {
            // ✅ Update existing user (created during subscription)
            user = existingUserOpt.get();
            user.setFullName(registrationRequest.getFullName());
            user.setRole(registrationRequest.getRole());
            user.setCountry(registrationRequest.getCountry());
            user.setPhoneNumber(registrationRequest.getPhoneNumber());
            user.setUsername(registrationRequest.getUsername());
            user.setCategory(registrationRequest.getCategory());
            user.setRequirement(registrationRequest.getRequirement());
            user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            user.setApprovalStatus(
                    // 👇 Pending for Buyer, Seller, Advertiser
                    (registrationRequest.getRole() == Role.BUYER
                            || registrationRequest.getRole() == Role.SELLER
                            || registrationRequest.getRole() == Role.ADVERTISER)
                            ? ApprovalStatus.PENDING
                            : ApprovalStatus.APPROVED
            );
        } else {
            // 👇 fallback if subscription didn’t create user
            user = User.builder()
                    .fullName(registrationRequest.getFullName())
                    .email(registrationRequest.getEmail())
                    .role(registrationRequest.getRole())
                    .country(registrationRequest.getCountry())
                    .phoneNumber(registrationRequest.getPhoneNumber())
                    .username(registrationRequest.getUsername())
                    .category(registrationRequest.getCategory())
                    .requirement(registrationRequest.getRequirement())
                    .password(passwordEncoder.encode(registrationRequest.getPassword()))
                    .approvalStatus(
                            (registrationRequest.getRole() == Role.BUYER
                                    || registrationRequest.getRole() == Role.SELLER
                                    || registrationRequest.getRole() == Role.ADVERTISER)
                                    ? ApprovalStatus.PENDING
                                    : ApprovalStatus.APPROVED
                    )
                    .trialUsed(false) // default
                    .build();
        }

        var savedUser = userRepository.save(user);

        // Block Buyer, Seller, Advertiser until approved
        if ((savedUser.getRole() == Role.BUYER
                || savedUser.getRole() == Role.SELLER
                || savedUser.getRole() == Role.ADVERTISER)
                && savedUser.getApprovalStatus() == ApprovalStatus.PENDING) {

            return JWTAuthenticationResponse.builder()
                    .token(null)
                    .refreshToken(null)
                    .email(savedUser.getEmail())
                    .fullName(savedUser.getFullName())
                    .role(savedUser.getRole().name())
                    .message("Your account is pending admin approval.")
                    .build();
        }

        // ✅ Only approved users get tokens
        var jwtToken = jwtService.generateToken(savedUser);
        var refreshToken = jwtService.generateRefreshToken(new HashMap<>(), savedUser);
        saveUserToken(savedUser, jwtToken);

        return JWTAuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .role(savedUser.getRole().name())
                .build();
    }


    public JWTAuthenticationResponse signin(SignInRequest signInRequest){
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signInRequest.getEmail(),
                signInRequest.getPassword()));

        var user = userRepository.findByEmail(signInRequest.getEmail()).orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (user.getRole() == Role.BUYER || user.getRole() == Role.SELLER || user.getRole() == Role.ADVERTISER) {
            if (user.getApprovalStatus().equals(ApprovalStatus.PENDING)) {
                return JWTAuthenticationResponse.builder()
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole().name())
                        .message("Your account is pending admin approval.")
                        .build();
            }
            if (user.getApprovalStatus().equals(ApprovalStatus.REJECTED)) {
                return JWTAuthenticationResponse.builder()
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole().name())
                        .message("Your registration was rejected by admin.")
                        .build();
            }
        }
        var jwt = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(new HashMap<>(), user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwt);

        return JWTAuthenticationResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .id(user.getId())
                .build();
    }

    public JWTAuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest){
        String userEmail = jwtService.extractUserName(refreshTokenRequest.getToken());
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        if(jwtService.isTokenValid(refreshTokenRequest.getToken(), user)){
            var jwt = jwtService.generateToken(user);

            JWTAuthenticationResponse jwtAuthenticationResponse = new JWTAuthenticationResponse();

            jwtAuthenticationResponse.setToken(jwt);
            jwtAuthenticationResponse.setRefreshToken(refreshTokenRequest.getToken());
            return jwtAuthenticationResponse;


        }

        return null;
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokensByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

}
