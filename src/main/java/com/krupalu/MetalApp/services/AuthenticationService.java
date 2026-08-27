package com.krupalu.MetalApp.services;

import com.krupalu.MetalApp.dto.JWTAuthenticationResponse;
import com.krupalu.MetalApp.dto.RefreshTokenRequest;
import com.krupalu.MetalApp.dto.SignInRequest;
import com.krupalu.MetalApp.dto.RegistrationRequest;

public interface AuthenticationService {

    JWTAuthenticationResponse registration(RegistrationRequest registrationRequest);

    JWTAuthenticationResponse signin(SignInRequest signInRequest);

    JWTAuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest);
}
