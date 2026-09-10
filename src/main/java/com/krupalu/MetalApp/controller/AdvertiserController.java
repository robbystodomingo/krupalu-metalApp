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
@RequestMapping("/api/v1/advertiserDashboard")
@RequiredArgsConstructor
@CrossOrigin()
public class AdvertiserController {

    private final UserService userService;

    private final ProductPostViewService productPostViewService;

    @GetMapping("/buyersList")
    public ResponseEntity<List<User>> getBuyers() {
        return ResponseEntity.ok(userService.getBuyers());
    }

    @GetMapping("/sellersList")
    public ResponseEntity<List<User>> getSellers() {
        return ResponseEntity.ok(userService.getSellers());
    }

    @GetMapping("/sellerProducts/{sellerId}")
    @PreAuthorize("hasAuthority('ADVERTISER')")
    public List<ProductPostRequest> getSellerProducts(@PathVariable String sellerId) {
        return productPostViewService.getApprovedPostsBySeller(sellerId);
    }
}
