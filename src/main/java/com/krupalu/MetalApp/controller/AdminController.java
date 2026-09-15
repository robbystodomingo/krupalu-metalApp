package com.krupalu.MetalApp.controller;

import com.krupalu.MetalApp.dto.AdvertisementPostRequest;
import com.krupalu.MetalApp.dto.ProductPostRequest;
import com.krupalu.MetalApp.entity.AdvertisementPost;
import com.krupalu.MetalApp.entity.ProductPost;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.services.AdminService;
import com.krupalu.MetalApp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    private final UserService userService;


    @GetMapping
    public ResponseEntity<String> sayHello(){
        return ResponseEntity.ok("Hi Admin");
    }

    // --- Buyers ---
    @GetMapping("/buyers/pending")
    public ResponseEntity<List<User>> getPendingBuyers() {
        return ResponseEntity.ok(adminService.getPendingBuyers());
    }

    @PostMapping("/buyers/{id}/approve")
    public ResponseEntity<User> approveBuyer(@PathVariable String id) {
        return ResponseEntity.ok(adminService.approveBuyer(id));
    }

    @PostMapping("/buyers/{id}/reject")
    public ResponseEntity<User> rejectBuyer(@PathVariable String id) {
        return ResponseEntity.ok(adminService.rejectBuyer(id));
    }

    // --- Products ---
    @GetMapping("/products/pending")
    public ResponseEntity<List<ProductPostRequest>> getPendingProducts() {
        return ResponseEntity.ok(adminService.getPendingProducts());
    }

    @PostMapping("/products/{id}/approve")
    public ResponseEntity<ProductPost> approveProduct(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveProduct(id));
    }

    @PostMapping("/products/{id}/reject")
    public ResponseEntity<ProductPost> rejectProduct(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.rejectProduct(id));
    }

    // --- Advertisements ---
    @GetMapping("/ads/pending")
    public ResponseEntity<List<AdvertisementPostRequest>> getPendingAdvertisements() {
        return ResponseEntity.ok(adminService.getPendingAdvertisements());
    }

    @PostMapping("/ads/{id}/approve")
    public ResponseEntity<AdvertisementPost> approveAdvertisement(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveAdvertisement(id));
    }

    @PostMapping("/ads/{id}/reject")
    public ResponseEntity<AdvertisementPost> rejectAdvertisement(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.rejectAdvertisement(id));
    }

    @GetMapping("/sellersList")
    public ResponseEntity<List<User>> getSellers() {
        return ResponseEntity.ok(userService.getSellers());
    }

    @GetMapping("/advertisersList")
    public ResponseEntity<List<User>> getAdvertisers() {
        return ResponseEntity.ok(userService.getAdvertisers());
    }

    @GetMapping("/buyersList")
    public ResponseEntity<List<User>> getBuyers() {
        return ResponseEntity.ok(userService.getBuyers());
    }
}
