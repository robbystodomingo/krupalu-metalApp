package com.krupalu.MetalApp.services.impl;

import com.krupalu.MetalApp.dto.AdvertisementPostRequest;
import com.krupalu.MetalApp.entity.AdvertisementPost;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.enums.ApprovalStatus;
import com.krupalu.MetalApp.repo.AdvertisementPostRepository;
import com.krupalu.MetalApp.repo.UserRepository;
import com.krupalu.MetalApp.services.AdvertisementPostService;
import com.krupalu.MetalApp.util.MyUserDetails;
import com.krupalu.MetalApp.util.PhotoUrlResolver;
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

    private static final String UPLOAD_ROOT = "D:/advertisements/";

    private final AdvertisementPostRepository advertisementPostRepository;
    private final UserRepository userRepository;
    private final PhotoUrlResolver photoUrlResolver;

    @Override
    public AdvertisementPost createAdvertisement(String userId, String advertisementName,
                                                 String description, List<MultipartFile> photos)
            throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        log.info(String.valueOf(user));

        AdvertisementPost tempPost = AdvertisementPost.builder()
                .advertisementName(advertisementName)
                .description(description)
                .approvalStatus(ApprovalStatus.PENDING)
                .user(user)
                .build();
        tempPost = advertisementPostRepository.save(tempPost);

        // Store RELATIVE web paths only — never the raw disk path.
        // PhotoUrlResolver applies the absolute URL only when reading data back out.
        List<String> photoPaths = new ArrayList<>();
        for (MultipartFile photo : photos) {
            String uploadDir = UPLOAD_ROOT + userId + "/" + tempPost.getId();
            Files.createDirectories(Paths.get(uploadDir));

            String fileName = tempPost.getId() + "_" + photo.getOriginalFilename();
            String filePath = uploadDir + "/" + fileName;

            Files.copy(photo.getInputStream(), Paths.get(filePath),
                    StandardCopyOption.REPLACE_EXISTING);

            String webPath = "/advertisements/" + userId + "/" + tempPost.getId() + "/" + fileName;

            log.info("Saved file at: {}", filePath);
            log.info("Web-servable path: {}", webPath);

            photoPaths.add(webPath);
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
                .map(post -> {
                    User advertiser = post.getUser();
                    return AdvertisementPostRequest.builder()
                            .id(post.getId())
                            .advertisementName(post.getAdvertisementName())
                            .description(post.getDescription())
                            .approvalStatus(post.getApprovalStatus())
                            .photoUrls(post.getPhotoUrls() != null
                                    ? post.getPhotoUrls().stream()
                                    .map(photoUrlResolver::resolve)
                                    .toList()
                                    : List.of())
                            .advertiserName(advertiser != null ? advertiser.getFullName() : null)
                            .advertiserEmail(advertiser != null ? advertiser.getEmail() : null)
                            .advertiserPhoneNumber(advertiser != null ? advertiser.getPhoneNumber() : null)
                            .userId(advertiser != null ? advertiser.getId() : null)
                            .build();
                })
                .toList();
    }

    @Override
    public AdvertisementPostRequest getAdvertisementById(Long id, String userId) {
        AdvertisementPost post = advertisementPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().toString().equals(userId)) {
            throw new RuntimeException("Unauthorized access to post");
        }

        User advertiser = post.getUser();

        return AdvertisementPostRequest.builder()
                .id(post.getId())
                .advertisementName(post.getAdvertisementName())
                .description(post.getDescription())
                .approvalStatus(post.getApprovalStatus())
                .photoUrls(post.getPhotoUrls() != null
                        ? post.getPhotoUrls().stream()
                        .map(photoUrlResolver::resolve)
                        .toList()
                        : List.of())
                .advertiserName(advertiser != null ? advertiser.getFullName() : null)
                .advertiserEmail(advertiser != null ? advertiser.getEmail() : null)
                .advertiserPhoneNumber(advertiser != null ? advertiser.getPhoneNumber() : null)
                .userId(advertiser != null ? advertiser.getId() : null)
                .build();
    }

    @Override
    public void deleteAdvertisement(Long advertisementId, String userId) throws IOException {
        AdvertisementPost post = advertisementPostRepository.findById(advertisementId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().toString().equals(userId)) {
            throw new RuntimeException("Unauthorized access to post");
        }

        if (post.getPhotoUrls() != null && !post.getPhotoUrls().isEmpty()) {
            Path postFolder = Paths.get(UPLOAD_ROOT + userId + "/" + advertisementId);
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

        advertisementPostRepository.delete(post);
    }

    @Override
    public AdvertisementPost updateAdvertisement(Long advertisementId, String userId, String advertisementName,
                                                 String description, List<MultipartFile> photos) throws IOException {
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
            String uploadDir = UPLOAD_ROOT + userId + "/" + advertisementId;
            Files.createDirectories(Paths.get(uploadDir));

            // Store RELATIVE web paths only — same as createAdvertisement.
            List<String> photoPaths = new ArrayList<>();
            for (MultipartFile photo : photos) {
                String fileName = advertisementId + "_" + photo.getOriginalFilename();
                String filePath = uploadDir + "/" + fileName;
                Files.copy(photo.getInputStream(), Paths.get(filePath),
                        StandardCopyOption.REPLACE_EXISTING);

                String webPath = "/advertisements/" + userId + "/" + advertisementId + "/" + fileName;
                photoPaths.add(webPath);
            }

            post.setPhotoUrls(photoPaths);
        }

        return advertisementPostRepository.save(post);
    }
}