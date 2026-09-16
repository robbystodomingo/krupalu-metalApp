package com.krupalu.MetalApp.repo;

import com.krupalu.MetalApp.entity.BuyerRequest;
import com.krupalu.MetalApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BuyerRequestRepository extends JpaRepository<BuyerRequest, String> {
    List<BuyerRequest> findByBuyer(User buyer);
}
