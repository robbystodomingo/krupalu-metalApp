package com.krupalu.MetalApp.services;

import com.krupalu.MetalApp.entity.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Map;

public interface JWTService {

    String extractUserName(String token);

    String generateToken(User user);

    boolean isTokenValid(String token, UserDetails userDetails);

    String generateRefreshToken(Map<String, Object> extraClaims, UserDetails userDetails);

    String getEmailFromToken(String token);

    String getFirstNameFromToken(String token);

    List<String> getRolesFromToken(String token);
}
