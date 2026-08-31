package com.krupalu.MetalApp.services.impl;


import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.enums.Role;
import com.krupalu.MetalApp.repo.UserRepository;
import com.krupalu.MetalApp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) {
                return userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
            }
        };
    }


    public List<User> getUsersByRole(Role role) {
        return userRepository.findListByRole(role);
    }
    public List<User> getSellers() {
        return getUsersByRole(Role.SELLER);
    }

    public List<User> getAdvertisers() {
        return userRepository.findListByRole(Role.ADVERTISER);
    }

    public List<User> getBuyers() {
        return userRepository.findListByRole(Role.BUYER);
    }
}
