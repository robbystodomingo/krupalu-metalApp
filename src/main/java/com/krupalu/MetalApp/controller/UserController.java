package com.krupalu.MetalApp.controller;


import com.krupalu.MetalApp.dto.UserUpdateRequest;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.enums.Role;
import com.krupalu.MetalApp.services.UserService;
import com.krupalu.MetalApp.util.MyUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal MyUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No authenticated user");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", userDetails.getId());
        response.put("email", userDetails.getUsername());
        response.put("fullName", userDetails.getFullName());
        response.put("country", userDetails.getCountry());
        response.put("phoneNumber", userDetails.getPhoneNumber());
        response.put("roles", userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/updateUser/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") String userId,
                                           @RequestBody UserUpdateRequest request) {
        User updated = userService.updateUser(userId, request);
        return ResponseEntity.ok(updated);
    }



}
