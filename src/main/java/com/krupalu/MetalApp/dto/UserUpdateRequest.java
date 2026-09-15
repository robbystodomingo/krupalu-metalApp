package com.krupalu.MetalApp.dto;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String fullName;
    private String email;
    private String phoneNumber;
    private String country;
    private String password;
}