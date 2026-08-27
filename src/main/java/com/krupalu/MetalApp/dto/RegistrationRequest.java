package com.krupalu.MetalApp.dto;

import com.krupalu.MetalApp.enums.Role;
import lombok.Data;

@Data
public class RegistrationRequest {

    private String fullName;

    private String email;

    private String password;

    private String country;

    private String phoneNumber;

    private String username;

    private String requirement;

    private String category;

    private Role role;


}
