package com.krupalu.MetalApp.controller;

import com.krupalu.MetalApp.dto.ProductPostRequest;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.services.ProductPostViewService;
import com.krupalu.MetalApp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/buyerDashboard")
@RequiredArgsConstructor
@CrossOrigin()
public class BuyerController {

    private final UserService userService;

    private final ProductPostViewService productPostViewService;

    @GetMapping("/sellersList")
    public ResponseEntity<List<User>> getSellers() {
        return ResponseEntity.ok(userService.getSellers());
    }

    @GetMapping("/advertisersList")
    public ResponseEntity<List<User>> getAdvertisers() {
        return ResponseEntity.ok(userService.getAdvertisers());
    }

    @GetMapping("/sellerProducts/{sellerId}")
    @PreAuthorize("hasAuthority('BUYER')")
    public List<ProductPostRequest> getSellerProducts(@PathVariable String sellerId) {
        return productPostViewService.getApprovedPostsBySeller(sellerId);
    }
}
