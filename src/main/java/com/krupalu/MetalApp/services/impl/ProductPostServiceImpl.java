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
import com.krupalu.MetalApp.util.PhotoUrlResolver;
import com.krupalu.MetalApp.util.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ProductPostServiceImpl implements ProductPostService {

    @Value("${app.upload-dir}")
    private String uploadRoot;
    private static final String UPLOAD_ROOT = "D:/uploads/";
    private final ProductPostRepository postRepository;
    private final ProductCategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PhotoUrlResolver photoUrlResolver;
    private final S3Service s3Service;


    @Override
    @Transactional
    public ProductPost createPost(String userId, String productName, Long categoryId,
                                  String description, List<MultipartFile> photos) throws IOException {
        ProductCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        log.info(String.valueOf(user));


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
            String key = "uploads/" + userId + "/" + tempPost.getId() + "/" + tempPost.getId() + "_" + photo.getOriginalFilename();
            s3Service.upload(photo, key);
            photoPaths.add(key);
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
                .map(p -> {
                    User seller = p.getUser();

                    List<String> presignedUrls = p.getPhotoUrls() != null
                            ? p.getPhotoUrls().stream()
                            .map(s3Service::getPresignedUrl)
                            .toList()
                            : List.of();

                    return ProductPostRequest.builder()
                            .id(p.getId())
                            .productName(p.getProductName())
                            .description(p.getDescription())
                            .approvalStatus(p.getApprovalStatus())
                            .photoUrls(presignedUrls)
                            .categoryName(p.getCategory() != null ? p.getCategory().getCategoryName() : null)
                            .sellerName(seller != null ? seller.getFullName() : null)
                            .sellerEmail(seller != null ? seller.getEmail() : null)
                            .sellerPhoneNumber(seller != null ? seller.getPhoneNumber() : null)
                            .userId(seller != null ? seller.getId() : null)
                            .build();
                })
                .toList();
    }


    @Override
    public ProductPostRequest getPostById(Long id, String userId) {
        ProductPost post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().toString().equals(userId)) {
            throw new RuntimeException("Unauthorized access to post");
        }

        User seller = post.getUser();

        List<String> presignedUrls = post.getPhotoUrls() != null
                ? post.getPhotoUrls().stream()
                .map(s3Service::getPresignedUrl)
                .toList()
                : List.of();

        return ProductPostRequest.builder()
                .id(post.getId())
                .productName(post.getProductName())
                .description(post.getDescription())
                .approvalStatus(post.getApprovalStatus())
                .photoUrls(presignedUrls)
                .categoryName(post.getCategory() != null ? post.getCategory().getCategoryName() : null)
                .sellerName(seller != null ? seller.getFullName() : null)
                .sellerEmail(seller != null ? seller.getEmail() : null)
                .sellerPhoneNumber(seller != null ? seller.getPhoneNumber() : null)
                .userId(seller != null ? String.valueOf(seller.getId()) : null)
                .build();
    }

    @Transactional
    public void deletePost(Long postId, String userId) throws IOException {
        ProductPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to post");
        }

        if (post.getPhotoUrls() != null && !post.getPhotoUrls().isEmpty()) {
            post.getPhotoUrls().forEach(s3Service::delete);
        }

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
            String uploadDir = uploadRoot + userId + "/" + postId;
            Files.createDirectories(Paths.get(uploadDir));

            // Store RELATIVE web paths only — same as createPost, no rewritePath() here.
            List<String> photoPaths = new ArrayList<>();
            for (MultipartFile photo : photos) {
                String key = "uploads/" + userId + "/" + post.getId() + "/" + post.getId() + "_" + photo.getOriginalFilename();
                s3Service.upload(photo, key);
                photoPaths.add(key);
            }

            post.setPhotoUrls(photoPaths);
        }

        return postRepository.save(post);
    }
}