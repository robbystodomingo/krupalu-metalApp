package com.krupalu.MetalApp.services.impl;

import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.enums.Role;
import com.krupalu.MetalApp.repo.UserRepository;
import com.krupalu.MetalApp.services.UserService;
import com.krupalu.MetalApp.util.MyUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    /**
     * Expose a UserDetailsService that Spring Security can use.
     * This version loads users by email (since your signin request uses email).
     */
    @Override
    public UserDetailsService userDetailsService() {
        return email -> {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            return new MyUserDetails(
                    user.getId(),
                    user.getEmail(),      // 👈 use email as username
                    user.getPassword(),
                    Collections.emptyList() // map roles to authorities if needed
            );
        };
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findListByRole(role);
    }

    public List<User> getSellers() {
        return getUsersByRole(Role.SELLER);
    }

    public List<User> getAdvertisers() {
        return getUsersByRole(Role.ADVERTISER);
    }

    public List<User> getBuyers() {
        return getUsersByRole(Role.BUYER);
    }
}
