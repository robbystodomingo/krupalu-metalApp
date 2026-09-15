package com.krupalu.MetalApp.services.impl;

import com.krupalu.MetalApp.dto.AdvertisementPostRequest;
import com.krupalu.MetalApp.dto.ProductPostRequest;
import com.krupalu.MetalApp.entity.AdvertisementPost;
import com.krupalu.MetalApp.entity.ProductPost;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.enums.ApprovalStatus;
import com.krupalu.MetalApp.enums.Role;
import com.krupalu.MetalApp.repo.AdvertisementPostRepository;
import com.krupalu.MetalApp.repo.ProductPostRepository;
import com.krupalu.MetalApp.repo.UserRepository;
import com.krupalu.MetalApp.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {


    private final UserRepository userRepository;
    private final ProductPostRepository productPostRepository;
    private final AdvertisementPostRepository advertisementPostRepository;


    @Override
    public List<User> getPendingBuyers() {
        return userRepository.findByRoleAndApprovalStatus(Role.BUYER, ApprovalStatus.PENDING);
    }

    @Override
    public User updateBuyerApproval(String userId, ApprovalStatus status) {
        User buyer = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
        buyer.setApprovalStatus(status);
        return userRepository.save(buyer);
    }

    @Override
    public ProductPost updateProductApproval(Long productId, ApprovalStatus status) {
        ProductPost product = productPostRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setApprovalStatus(status);
        return productPostRepository.save(product);
    }

    @Override
    public AdvertisementPost updateAdvertisementApproval(Long adId, ApprovalStatus status) {
        AdvertisementPost ad = advertisementPostRepository.findById(adId)
                .orElseThrow(() -> new RuntimeException("Advertisement not found"));
        ad.setApprovalStatus(status);
        return advertisementPostRepository.save(ad);
    }

    @Override
    public User approveBuyer(String userId) {
        return updateBuyerApproval(userId, ApprovalStatus.APPROVED);
    }

    @Override
    public User rejectBuyer(String userId) {
        return updateBuyerApproval(userId, ApprovalStatus.REJECTED);
    }

    @Override
    public ProductPost approveProduct(Long productId) {
        return updateProductApproval(productId, ApprovalStatus.APPROVED);
    }

    @Override
    public ProductPost rejectProduct(Long productId) {
        return updateProductApproval(productId, ApprovalStatus.REJECTED);
    }

    @Override
    public AdvertisementPost approveAdvertisement(Long adId) {
        return updateAdvertisementApproval(adId, ApprovalStatus.APPROVED);
    }

    @Override
    public AdvertisementPost rejectAdvertisement(Long adId) {
        return updateAdvertisementApproval(adId, ApprovalStatus.REJECTED);
    }

    @Override
    public List<ProductPostRequest> getPendingProducts() {
        List<ProductPost> posts = productPostRepository.findByApprovalStatus(ApprovalStatus.PENDING);

        return posts.stream()
                .map(p -> {
                    User seller = p.getUser();
                    return ProductPostRequest.builder()
                            .id(p.getId())
                            .productName(p.getProductName())
                            .description(p.getDescription())
                            .approvalStatus(p.getApprovalStatus())
                            .photoUrls(p.getPhotoUrls())
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
    public List<AdvertisementPostRequest> getPendingAdvertisements() {
        List<AdvertisementPost> posts = advertisementPostRepository.findByApprovalStatus(ApprovalStatus.PENDING);

        return posts.stream()
                .map(a -> {
                    User advertiser = a.getUser();
                    return AdvertisementPostRequest.builder()
                            .id(a.getId())
                            .advertisementName(a.getAdvertisementName())
                            .description(a.getDescription())
                            .approvalStatus(a.getApprovalStatus())
                            .photoUrls(a.getPhotoUrls())
                            .advertiserName(advertiser != null ? advertiser.getFullName() : null)
                            .advertiserEmail(advertiser != null ? advertiser.getEmail() : null)
                            .advertiserPhoneNumber(advertiser != null ? advertiser.getPhoneNumber() : null)
                            .userId(advertiser != null ? advertiser.getId() : null)
                            .build();
                })
                .toList();
    }
}
