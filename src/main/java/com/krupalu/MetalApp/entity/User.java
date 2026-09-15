package com.krupalu.MetalApp.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.krupalu.MetalApp.enums.ApprovalStatus;
import com.krupalu.MetalApp.enums.Role;
import com.krupalu.MetalApp.util.CustomIdGenerator;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user")
public class User implements UserDetails {

    @Id
    private String id;
    private String fullName;

    private String username;

    private String country;

    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone must be 10–15 digits")
    private String phoneNumber;
    @Email(message = "Invalid email format")
    private String email;

    private String password;

    private boolean trialUsed;

    private String stripeSubscriptionId;

    @Enumerated(EnumType.STRING)
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @Column(length = 1000)
    private String requirement;

    private String category;
    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<ProductPost> posts = new ArrayList<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {

        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = CustomIdGenerator.generateId();
        }
    }
}
