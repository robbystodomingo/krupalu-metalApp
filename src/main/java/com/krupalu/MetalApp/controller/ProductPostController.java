package com.krupalu.MetalApp.controller;

import com.krupalu.MetalApp.dto.ProductPostRequest;
import com.krupalu.MetalApp.entity.ProductPost;
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
@RequestMapping("/api/v1/sellerDashboard/posts")
public class ProductPostController {

    private final ProductPostService productPostService;

    @PostMapping("/createPosting")
    public ResponseEntity<ProductPost> createPost(@AuthenticationPrincipal MyUserDetails userDetails,
                                                  @RequestParam String productName,
                                                  @RequestParam Long categoryId,
                                                  @RequestParam String description,
                                                  @RequestParam("photos") List<MultipartFile> photos) throws IOException {
        String userId = userDetails.getId();
        log.info("User id:" + userId);
        ProductPost post = productPostService.createPost(userId, productName, categoryId, description, photos);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/getAllPosting")
    public List<ProductPostRequest> getAllPostingsForLoggedInUser() {
        return productPostService.getAllPostings();
    }


    @GetMapping("/{id}")
    public ResponseEntity<ProductPostRequest> getPost(@PathVariable Long id,
                                                      @AuthenticationPrincipal MyUserDetails userDetails) {
        String userId = userDetails.getId();
        log.info("Fetching post {} for user {}", id, userId);
        ProductPostRequest post = productPostService.getPostById(id, userId);
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id,
                                             @AuthenticationPrincipal MyUserDetails userDetails) throws IOException {
        String userId = userDetails.getId();
        productPostService.deletePost(id, userId);
        return ResponseEntity.ok("Post deleted successfully");
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<ProductPost> editPost(@PathVariable Long id,
                                                @AuthenticationPrincipal MyUserDetails userDetails,
                                                @RequestParam(required = false) String productName,
                                                @RequestParam(required = false) Long categoryId,
                                                @RequestParam(required = false) String description,
                                                @RequestParam(value = "photos", required = false) List<MultipartFile> photos) throws IOException {
        String userId = userDetails.getId();
        ProductPost updatedPost = productPostService.updatePost(id, userId, productName, categoryId, description, photos);
        return ResponseEntity.ok(updatedPost);
    }




}
