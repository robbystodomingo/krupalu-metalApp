package com.krupalu.MetalApp.repo;


import com.krupalu.MetalApp.enums.ApprovalStatus;
import com.krupalu.MetalApp.enums.Role;
import com.krupalu.MetalApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,String> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findListByRole(Role role);

    Optional<User> findByUsername(String username);

    List<User> findByRoleAndApprovalStatus(Role role, ApprovalStatus status);

    boolean existsByEmail(String email);

}
