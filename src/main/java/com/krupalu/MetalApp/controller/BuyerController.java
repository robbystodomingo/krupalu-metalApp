package com.krupalu.MetalApp.controller;

import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/buyerDashboard")
@RequiredArgsConstructor
@CrossOrigin()
public class BuyerController {

    private final UserService userService;

    @GetMapping("/sellersList")
    public ResponseEntity<List<User>> getSellers() {
        return ResponseEntity.ok(userService.getSellers());
    }

    @GetMapping("/advertisersList")
    public ResponseEntity<List<User>> getAdvertisers() {
        return ResponseEntity.ok(userService.getAdvertisers());
    }
}
