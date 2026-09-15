package com.krupalu.MetalApp.services;

import com.krupalu.MetalApp.dto.UserUpdateRequest;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.enums.Role;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService {
    UserDetailsService userDetailsService();

    public List<User> getSellers();

    public List<User> getBuyers();

    public List<User> getAdvertisers();

    public boolean userExists(String email);

    User updateUser(String userId, UserUpdateRequest request);

    void changePassword(String userId, String oldPassword, String newPassword);
}
