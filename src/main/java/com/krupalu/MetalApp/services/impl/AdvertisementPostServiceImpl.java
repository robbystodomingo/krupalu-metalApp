package com.krupalu.MetalApp.services.impl;

import com.krupalu.MetalApp.dto.AdvertisementPostRequest;
import com.krupalu.MetalApp.dto.ProductPostRequest;
import com.krupalu.MetalApp.entity.AdvertisementPost;
import com.krupalu.MetalApp.entity.ProductCategory;
import com.krupalu.MetalApp.entity.ProductPost;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.enums.ApprovalStatus;
import com.krupalu.MetalApp.repo.AdvertisementPostRepository;
import com.krupalu.MetalApp.repo.UserRepository;
import com.krupalu.MetalApp.services.AdvertisementPostService;
import com.krupalu.MetalApp.util.MyUserDetails;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
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
public class AdvertisementPostServiceImpl implements AdvertisementPostService {

    private final AdvertisementPostRepository advertisementPostRepository;

    private final UserRepository userRepository;

    @Override
    public AdvertisementPost createAdvertisement(String userId, String advertisementName,
                                                 String description, List<MultipartFile> photos)
                                                 throws IOException {
        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));
        log.info(String.valueOf(user));

        // Save a post first to get its ID
        AdvertisementPost tempPost = AdvertisementPost.builder()
                .advertisementName(advertisementName)
                .description(description)
                .approvalStatus(ApprovalStatus.PENDING)
                .user(user)
                .build();
        tempPost = advertisementPostRepository.save(tempPost);

        List<String> photoPaths = new ArrayList<>();
        for (MultipartFile photo : photos) {
            // 👇 include post ID in the folder path
            String uploadDir = "D:/advertisements/" + userId + "/" + tempPost.getId();
            Files.createDirectories(Paths.get(uploadDir));

            // 👇 prefix filename with post ID to avoid collisions
            String fileName = tempPost.getId() + "_" + photo.getOriginalFilename();
            String filePath = uploadDir + "/" + fileName;

            Files.copy(photo.getInputStream(), Paths.get(filePath),
                    StandardCopyOption.REPLACE_EXISTING);


            log.info("Saved file at: {}", filePath);
            log.info("Rewritten URL: {}", rewritePath(filePath));

            photoPaths.add(filePath);
        }

        tempPost.setPhotoUrls(photoPaths);
        return advertisementPostRepository.save(tempPost);
    }

    @Override
    public List<AdvertisementPostRequest> getAllAdvertisements() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails userDetails = (MyUserDetails) auth.getPrincipal();
        String userId = userDetails.getId();
        return advertisementPostRepository.findByUserId(userId).stream()
                .map(post -> new AdvertisementPostRequest(
                        post.getId(),
                        post.getAdvertisementName(),
                        post.getDescription(),
                        post.getPhotoUrls().stream()
                                .map(this::rewritePath)
                                .toList()
                ))
                .toList();
    }

    @Override
    public AdvertisementPostRequest getAdvertisementById(Long id, String userId) {
        AdvertisementPost post = advertisementPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Optional: enforce ownership
        if (!post.getUser().getId().toString().equals(userId)) {
            throw new RuntimeException("Unauthorized access to post");
        }

        return new AdvertisementPostRequest(
                post.getId(),
                post.getAdvertisementName(),
                post.getDescription(),
                post.getPhotoUrls().stream()
                        .map(this::rewritePath)
                        .toList()

        );
    }

    @Override
    public void deleteAdvertisement(Long advertisementId, String userId) throws IOException {
        AdvertisementPost post = advertisementPostRepository.findById(advertisementId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Optional: enforce ownership
        if (!post.getUser().getId().toString().equals(userId)) {
            throw new RuntimeException("Unauthorized access to post");
        }

        // Delete files from disk
        if (post.getPhotoUrls() != null && !post.getPhotoUrls().isEmpty()) {
            // All photo paths share the same folder: D:/uploads/<userId>/<postId>
            Path postFolder = Paths.get("D:/advertisements/" + userId + "/" + advertisementId);
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
        advertisementPostRepository.delete(post);
    }

    @Override
    public AdvertisementPost updateAdvertisement(Long advertisementId, String userId, String advertisementName, String description, List<MultipartFile> photos) throws IOException {
        AdvertisementPost post = advertisementPostRepository.findById(advertisementId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().toString().equals(userId)) {
            throw new RuntimeException("Unauthorized access to post");
        }

        if (advertisementName != null) {
            post.setAdvertisementName(advertisementName);
        }
        if (description != null) {
            post.setDescription(description);
        }

        if (photos != null && !photos.isEmpty()) {
            // Replace photos logic (delete old, save new)
            List<String> photoPaths = new ArrayList<>();
            String uploadDir = "D:/advertisements/" + userId + "/" + advertisementId;
            Files.createDirectories(Paths.get(uploadDir));

            // Optional: clear old files
            if (post.getPhotoUrls() != null) {
                for (String oldPath : post.getPhotoUrls()) {
                    try { Files.deleteIfExists(Paths.get(oldPath)); } catch (IOException ignored) {}
                }
            }

            for (MultipartFile photo : photos) {
                String fileName = advertisementId + "_" + photo.getOriginalFilename();
                String filePath = uploadDir + "/" + fileName;
                Files.copy(photo.getInputStream(), Paths.get(filePath),
                        StandardCopyOption.REPLACE_EXISTING);
                photoPaths.add(filePath);
            }
            post.setPhotoUrls(photoPaths);
        }

        return advertisementPostRepository.save(post);
    }

    private String rewritePath(String localPath) {
        String baseUrl = "http://localhost:8082/advertisements";

        String relativePath = localPath
                .replace("D:/advertisements", "")
                .replace("D:\\advertisements", "")
                .replace("\\", "/");


        if (relativePath.startsWith("/")) {
            return baseUrl + relativePath;
        } else {
            return baseUrl + "/" + relativePath;
        }
    }
}
