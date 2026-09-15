package com.krupalu.MetalApp.services.impl;

import com.krupalu.MetalApp.dto.ProductPostRequest;
import com.krupalu.MetalApp.entity.ProductCategory;
import com.krupalu.MetalApp.entity.ProductPost;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.enums.ApprovalStatus;
import com.krupalu.MetalApp.repo.ProductCategoryRepository;
import com.krupalu.MetalApp.repo.ProductPostRepository;
import com.krupalu.MetalApp.repo.UserRepository;
import com.krupalu.MetalApp.services.ProductPostService;
import com.krupalu.MetalApp.util.MyUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ProductPostServiceImpl implements ProductPostService {

    private final ProductPostRepository postRepository;
    private final ProductCategoryRepository categoryRepository;

    private final UserRepository userRepository;

    @Override
    @Transactional
    public ProductPost createPost(String userId, String productName, Long categoryId,
                                  String description, List<MultipartFile> photos) throws IOException {
        ProductCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        log.info(String.valueOf(user));

        // Save a post first to get its ID
        ProductPost tempPost = ProductPost.builder()
                .productName(productName)
                .category(category)
                .description(description)
                .approvalStatus(ApprovalStatus.PENDING)
                .user(user)
                .build();
        tempPost = postRepository.save(tempPost);

        List<String> photoPaths = new ArrayList<>();
        for (MultipartFile photo : photos) {
            String uploadDir = "D:/uploads/" + userId + "/" + tempPost.getId();
            Files.createDirectories(Paths.get(uploadDir));

            String fileName = tempPost.getId() + "_" + photo.getOriginalFilename();
            String filePath = uploadDir + "/" + fileName;

            Files.copy(photo.getInputStream(), Paths.get(filePath),
                    StandardCopyOption.REPLACE_EXISTING);

            // Store the web-servable path, not the disk path
            String webPath = "/uploads/" + userId + "/" + tempPost.getId() + "/" + fileName;

            log.info("Saved file at: {}", filePath);
            log.info("Web-servable path: {}", webPath);

            photoPaths.add(webPath);
        }

        tempPost.setPhotoUrls(photoPaths);
        return postRepository.save(tempPost);
    }





    @Override
    public List<ProductPostRequest> getAllPostings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails userDetails = (MyUserDetails) auth.getPrincipal();
        String userId = userDetails.getId();
        String role = userDetails.getRole().name();

        List<ProductPost> posts;

        if ("SELLER".equalsIgnoreCase(role)) {
            posts = postRepository.findByUserId(userId);
        } else {
            posts = postRepository.findByUser_IdAndApprovalStatus(userId, ApprovalStatus.APPROVED);
        }

        return posts.stream()
                .map(post -> new ProductPostRequest(
                        post.getId(),
                        post.getProductName(),
                        post.getDescription(),
                        post.getPhotoUrls().stream()
                                .map(this::rewritePath)
                                .toList(),
                        post.getCategory() != null ? post.getCategory().getCategoryName() : null
                ))
                .toList();
    }


    @Override
    public ProductPostRequest getPostById(Long id, String userId) {
        ProductPost post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to post");
        }

        return new ProductPostRequest(
                post.getId(),
                post.getProductName(),
                post.getDescription(),
                post.getPhotoUrls().stream()
                        .map(this::rewritePath)
                        .toList(),
                post.getCategory() != null ? post.getCategory().getCategoryName() : null
        );
    }


    private String rewritePath(String localPath) {
        String baseUrl = "http://localhost:8082/uploads";

        // Normalize both forward and backward slashes
        String relativePath = localPath
                .replace("D:/uploads", "")
                .replace("D:\\uploads", "")
                .replace("\\", "/");

        // Ensure no accidental double slashes
        if (relativePath.startsWith("/")) {
            return baseUrl + relativePath;
        } else {
            return baseUrl + "/" + relativePath;
        }
    }


    @Transactional
    public void deletePost(Long postId, String userId) throws IOException {
        ProductPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));


        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to post");
        }

        // Delete files from disk
        if (post.getPhotoUrls() != null && !post.getPhotoUrls().isEmpty()) {
            // All photo paths share the same folder: D:/uploads/<userId>/<postId>
            Path postFolder = Paths.get("D:/uploads/" + userId + "/" + postId);
            if (Files.exists(postFolder)) {
                // Recursively delete folder and contents
                Files.walk(postFolder)
                        .sorted((a, b) -> b.compareTo(a)) // delete children before parent
                        .forEach(path -> {
                            try {
                                Files.delete(path);
                            } catch (IOException e) {
                                log.error("Failed to delete file: " + path, e);
                            }
                        });
            }
        }

        // Delete post from DB
        postRepository.delete(post);
    }

    @Override
    @Transactional
    public ProductPost updatePost(Long postId, String userId,
                                  String productName, Long categoryId,
                                  String description, List<MultipartFile> photos) throws IOException {
        ProductPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to post");
        }

        if (productName != null) {
            post.setProductName(productName);
        }
        if (description != null) {
            post.setDescription(description);
        }
        if (categoryId != null) {
            ProductCategory category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            post.setCategory(category);
        }
        if (photos != null && !photos.isEmpty()) {
            // Replace photos logic (delete old, save new)
            List<String> photoPaths = new ArrayList<>();
            String uploadDir = "D:/uploads/" + userId + "/" + postId;
            Files.createDirectories(Paths.get(uploadDir));

            // Optional: clear old files
            if (post.getPhotoUrls() != null) {
                for (String oldPath : post.getPhotoUrls()) {
                    try { Files.deleteIfExists(Paths.get(oldPath)); } catch (IOException ignored) {}
                }
            }

            for (MultipartFile photo : photos) {
                String fileName = postId + "_" + photo.getOriginalFilename();
                String filePath = uploadDir + "/" + fileName;
                Files.copy(photo.getInputStream(), Paths.get(filePath),
                        StandardCopyOption.REPLACE_EXISTING);
                photoPaths.add(filePath);
            }
            post.setPhotoUrls(photoPaths);
        }

        return postRepository.save(post);
    }

}
