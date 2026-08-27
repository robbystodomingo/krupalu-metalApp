package com.krupalu.MetalApp.services.impl;

import com.krupalu.MetalApp.dto.JWTAuthenticationResponse;
import com.krupalu.MetalApp.dto.RefreshTokenRequest;
import com.krupalu.MetalApp.dto.SignInRequest;
import com.krupalu.MetalApp.dto.RegistrationRequest;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.repo.UserRepository;
import com.krupalu.MetalApp.services.AuthenticationService;
import com.krupalu.MetalApp.services.JWTService;
import com.krupalu.MetalApp.token.Token;
import com.krupalu.MetalApp.token.TokenRepository;
import com.krupalu.MetalApp.token.TokenType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
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


    public JWTAuthenticationResponse registration(RegistrationRequest registrationRequest){
        var user = User.builder()
                .fullName(registrationRequest.getFullName())
                .email(registrationRequest.getEmail())
                .role(registrationRequest.getRole())
                .country(registrationRequest.getCountry())
                .phoneNumber(registrationRequest.getPhoneNumber())
                .username(registrationRequest.getUsername())
                .category(registrationRequest.getCategory())
                .requirement(registrationRequest.getRequirement())
                .password(passwordEncoder.encode(registrationRequest.getPassword()))
                .build();

        var savedUser = userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(new HashMap<>(),user);
        saveUserToken(savedUser,jwtToken);
        return JWTAuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    public JWTAuthenticationResponse signin(SignInRequest signInRequest){
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signInRequest.getEmail(),
                signInRequest.getPassword()));

        var user = userRepository.findByEmail(signInRequest.getEmail()).orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        var jwt = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(new HashMap<>(), user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwt);

        ResponseEntity.ok().header(
                        HttpHeaders.AUTHORIZATION,
                        jwtService.generateToken(user)
                )
                .body(user);
        return JWTAuthenticationResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
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
