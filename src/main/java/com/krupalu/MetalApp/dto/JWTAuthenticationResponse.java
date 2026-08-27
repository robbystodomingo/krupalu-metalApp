package com.krupalu.MetalApp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JWTAuthenticationResponse {
    private String token;

    private String refreshToken;

    private String email;

    private String fullName;

    private String role;
}
