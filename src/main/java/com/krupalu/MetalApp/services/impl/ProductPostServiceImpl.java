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
            String uploadDir = uploadRoot + userId + "/" + tempPost.getId();
            Files.createDirectories(Paths.get(uploadDir));

            String fileName = tempPost.getId() + "_" + photo.getOriginalFilename();
            String filePath = uploadDir + "/" + fileName;

            Files.copy(photo.getInputStream(), Paths.get(filePath),
                    StandardCopyOption.REPLACE_EXISTING);

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
                .map(p -> {
                    User seller = p.getUser();

                    List<String> rewrittenUrls = p.getPhotoUrls() != null
                            ? p.getPhotoUrls().stream()
                            .map(photoUrlResolver::resolve)
                            .collect(Collectors.toCollection(ArrayList::new))
                            : new ArrayList<>();

                    return ProductPostRequest.builder()
                            .id(p.getId())
                            .productName(p.getProductName())
                            .description(p.getDescription())
                            .approvalStatus(p.getApprovalStatus())
                            .photoUrls(rewrittenUrls)
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

        List<String> rewrittenUrls = post.getPhotoUrls() != null
                ? post.getPhotoUrls().stream()
                .map(photoUrlResolver::resolve)
                .collect(Collectors.toCollection(ArrayList::new))
                : new ArrayList<>();

        return ProductPostRequest.builder()
                .id(post.getId())
                .productName(post.getProductName())
                .description(post.getDescription())
                .approvalStatus(post.getApprovalStatus())
                .photoUrls(rewrittenUrls)
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
            Path postFolder = Paths.get(uploadRoot + userId + "/" + postId);
            if (Files.exists(postFolder)) {
                Files.walk(postFolder)
                        .sorted((a, b) -> b.compareTo(a))
                        .forEach(path -> {
                            try {
                                Files.delete(path);
                            } catch (IOException e) {
                                log.error("Failed to delete file: " + path, e);
                            }
                        });
            }
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
                String fileName = postId + "_" + photo.getOriginalFilename();
                String filePath = uploadDir + "/" + fileName;
                Files.copy(photo.getInputStream(), Paths.get(filePath),
                        StandardCopyOption.REPLACE_EXISTING);

                String webPath = "/uploads/" + userId + "/" + postId + "/" + fileName;
                photoPaths.add(webPath);
            }

            post.setPhotoUrls(photoPaths);
        }

        return postRepository.save(post);
    }
}