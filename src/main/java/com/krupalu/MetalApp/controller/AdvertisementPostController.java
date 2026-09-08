package com.krupalu.MetalApp.controller;

import com.krupalu.MetalApp.dto.AdvertisementPostRequest;
import com.krupalu.MetalApp.dto.ProductPostRequest;
import com.krupalu.MetalApp.entity.AdvertisementPost;
import com.krupalu.MetalApp.entity.ProductPost;
import com.krupalu.MetalApp.services.AdvertisementPostService;
import com.krupalu.MetalApp.services.ProductPostService;
import com.krupalu.MetalApp.util.MyUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


@RestController
@RequiredArgsConstructor
@CrossOrigin()
@Slf4j
@RequestMapping("/api/v1/advertiserDashboard/advertisements")
public class AdvertisementPostController {

    private final AdvertisementPostService advertisementPostService;

    @PostMapping("/createAdvertisement")
    public ResponseEntity<AdvertisementPost> createPost(@AuthenticationPrincipal MyUserDetails userDetails,
                                                        @RequestParam String advertisementName,
                                                        @RequestParam String description,
                                                        @RequestParam("photos") List<MultipartFile> photos) throws IOException {
        String userId = userDetails.getId();
        log.info("User id:" + userId);
        AdvertisementPost post = advertisementPostService.createAdvertisement(userId, advertisementName, description, photos);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/getAllAdvertisements")
    public List<AdvertisementPostRequest> getAlladvertisementForLoggedInUser() {
        return advertisementPostService.getAllAdvertisements();
    }


    @GetMapping("/{id}")
    public ResponseEntity<AdvertisementPostRequest> getPost(@PathVariable Long id,
                                                      @AuthenticationPrincipal MyUserDetails userDetails) {
        String userId = userDetails.getId();
        log.info("Fetching post {} for user {}", id, userId);
        AdvertisementPostRequest post = advertisementPostService.getAdvertisementById(id, userId);
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id,
                                             @AuthenticationPrincipal MyUserDetails userDetails) throws IOException {
        String userId = userDetails.getId();
        advertisementPostService.deleteAdvertisement(id, userId);
        return ResponseEntity.ok("Advertisement deleted successfully");
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<AdvertisementPost> editAdvertisement(@PathVariable Long id,
                                                @AuthenticationPrincipal MyUserDetails userDetails,
                                                @RequestParam(required = false) String advertisementName,
                                                @RequestParam(required = false) String description,
                                                @RequestParam(value = "photos", required = false) List<MultipartFile> photos) throws IOException {
        String userId = userDetails.getId();
        AdvertisementPost updatedPost = advertisementPostService.updateAdvertisement(id, userId, advertisementName, description, photos);
        return ResponseEntity.ok(updatedPost);
    }




}
