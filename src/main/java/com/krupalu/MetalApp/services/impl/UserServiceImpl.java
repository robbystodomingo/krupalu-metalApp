package com.krupalu.MetalApp.services.impl;

import com.krupalu.MetalApp.dto.UserUpdateRequest;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.enums.ApprovalStatus;
import com.krupalu.MetalApp.enums.Role;
import com.krupalu.MetalApp.repo.UserRepository;
import com.krupalu.MetalApp.services.UserService;
import com.krupalu.MetalApp.util.MyUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetailsService userDetailsService() {
        return email -> {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            return new MyUserDetails(
                    user.getId(),
                    user.getEmail(),
                    user.getPassword(),
                    user.getFullName(),
                    user.getCountry(),
                    user.getPhoneNumber(),
                    user.getRole(),
                    Collections.emptyList()
            );

        };
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findListByRole(role);
    }

    public List<User> getSellers() {
        return userRepository.findByRoleAndApprovalStatus(Role.SELLER, ApprovalStatus.APPROVED);
    }

    public List<User> getAdvertisers() {
        return userRepository.findByRoleAndApprovalStatus(Role.ADVERTISER, ApprovalStatus.APPROVED);
    }

    @Override
    public List<User> getSellersForAdmin() {
        return getUsersByRole(Role.SELLER);
    }

    @Override
    public List<User> getBuyersForAdmin() {
        return getUsersByRole(Role.BUYER);
    }

    @Override
    public List<User> getAdvertisersForAdmin() {
        return getUsersByRole(Role.ADVERTISER);
    }

    public List<User> getBuyers() {
        return userRepository.findByRoleAndApprovalStatus(Role.BUYER, ApprovalStatus.APPROVED);
    }



    @Override
    public boolean userExists(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public User updateUser(String userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getCountry() != null) user.setCountry(request.getCountry());

        return userRepository.save(user);
    }

    @Override
    public void changePassword(String userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

}
