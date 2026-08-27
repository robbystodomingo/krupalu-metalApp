package com.krupalu.MetalApp.repo;


import com.krupalu.MetalApp.enums.Role;
import com.krupalu.MetalApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByEmail(String email);

    User findByRole(Role role);

    Optional<User> findByUsername(String username);

}
