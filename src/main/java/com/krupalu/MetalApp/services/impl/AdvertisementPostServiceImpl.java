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
import com.krupalu.MetalApp.util.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${app.ads-dir}")
    private String uploadRoot;

    private static final String UPLOAD_ROOT = "D:/advertisements/";
    private final AdvertisementPostRepository advertisementPostRepository;
    private final UserRepository userRepository;
    private final PhotoUrlResolver photoUrlResolver;

    private final S3Service s3Service;

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

        List<String> photoPaths = new ArrayList<>();
        for (MultipartFile photo : photos) {
            String key = "uploads/" + userId + "/" + tempPost.getId() + "/" + tempPost.getId() + "_" + photo.getOriginalFilename();
            s3Service.upload(photo, key);
            photoPaths.add(key);
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
                                    .map(s3Service::getPresignedUrl)
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

        List<String> presignedUrls = post.getPhotoUrls() != null
                ? post.getPhotoUrls().stream()
                .map(s3Service::getPresignedUrl)
                .toList()
                : List.of();

        return AdvertisementPostRequest.builder()
                .id(post.getId())
                .advertisementName(post.getAdvertisementName())
                .description(post.getDescription())
                .approvalStatus(post.getApprovalStatus())
                .photoUrls(presignedUrls)
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
            post.getPhotoUrls().forEach(s3Service::delete);
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
            String uploadDir = uploadRoot + userId + "/" + advertisementId;
            Files.createDirectories(Paths.get(uploadDir));

            List<String> photoPaths = new ArrayList<>();
            for (MultipartFile photo : photos) {
                String key = "uploads/" + userId + "/" + post.getId() + "/" + post.getId() + "_" + photo.getOriginalFilename();
                s3Service.upload(photo, key);
                photoPaths.add(key);
            }

            post.setPhotoUrls(photoPaths);
        }

        return advertisementPostRepository.save(post);
    }
}