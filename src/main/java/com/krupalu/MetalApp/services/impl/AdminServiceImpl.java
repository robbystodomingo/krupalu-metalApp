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
import com.krupalu.MetalApp.services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {


    private final UserRepository userRepository;
    private final ProductPostRepository productPostRepository;
    private final AdvertisementPostRepository advertisementPostRepository;

    private final EmailService emailService;


    @Override
    public List<User> getPendingBuyers() {
        return userRepository.findByRoleAndApprovalStatus(Role.BUYER, ApprovalStatus.PENDING);
    }

    @Override
    public List<User> getPendingSellers() {
        return userRepository.findByRoleAndApprovalStatus(Role.SELLER, ApprovalStatus.PENDING);
    }

    @Override
    public List<User> getPendingAdvertisers() {
        return userRepository.findByRoleAndApprovalStatus(Role.ADVERTISER, ApprovalStatus.PENDING);
    }

    @Override
    public User updateBuyerApproval(String userId, ApprovalStatus status) {
        User buyer = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
        buyer.setApprovalStatus(status);
        return userRepository.save(buyer);
    }

    @Override
    public User updateSellerApproval(String userId, ApprovalStatus status) {
        User seller = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        seller.setApprovalStatus(status);
        return userRepository.save(seller);
    }

    @Override
    public User updateAdvertiserApproval(String userId, ApprovalStatus status) {
        User advertiser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Advertiser not found"));
        advertiser.setApprovalStatus(status);
        return userRepository.save(advertiser);
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
    public User updateBuyerRequirement(String userId, String requirement) {
        User buyer = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
        buyer.setRequirement(requirement);
        User saved = userRepository.save(buyer);
        emailService.sendRequirementEditedEmail(saved.getEmail(), saved.getFullName(), "Buyer");
        return saved;
    }

    @Override
    public User updateSellerRequirement(String userId, String requirement) {
        User seller = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        seller.setRequirement(requirement);
        User saved = userRepository.save(seller);
        emailService.sendRequirementEditedEmail(saved.getEmail(), saved.getFullName(), "Seller");
        return saved;
    }

    @Override
    public User updateAdvertiserRequirement(String userId, String requirement) {
        User advertiser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Advertiser not found"));
        advertiser.setRequirement(requirement);
        User saved = userRepository.save(advertiser);
        emailService.sendRequirementEditedEmail(saved.getEmail(), saved.getFullName(), "Advertiser");
        return saved;
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

    @Override
    public User approveBuyer(String userId) {
        User buyer = updateBuyerApproval(userId, ApprovalStatus.APPROVED);
        emailService.sendApprovalEmail(buyer.getEmail(), buyer.getFullName(), "Buyer");
        return buyer;
    }

    @Override
    public User rejectBuyer(String userId) {
        User buyer = updateBuyerApproval(userId, ApprovalStatus.REJECTED);
        emailService.sendRejectionEmail(buyer.getEmail(), buyer.getFullName(), "Buyer");
        return buyer;
    }

    @Override
    public User approveSeller(String userId) {
        User seller = updateSellerApproval(userId, ApprovalStatus.APPROVED);
        emailService.sendApprovalEmail(seller.getEmail(), seller.getFullName(), "Seller");
        return seller;
    }

    @Override
    public User rejectSeller(String userId) {
        User seller = updateSellerApproval(userId, ApprovalStatus.REJECTED);
        emailService.sendRejectionEmail(seller.getEmail(), seller.getFullName(), "Seller");
        return seller;
    }

    @Override
    public User approveAdvertiser(String userId) {
        User advertiser = updateAdvertiserApproval(userId, ApprovalStatus.APPROVED);
        emailService.sendApprovalEmail(advertiser.getEmail(), advertiser.getFullName(), "Advertiser");
        return advertiser;
    }

    @Override
    public User rejectAdvertiser(String userId) {
        User advertiser = updateAdvertiserApproval(userId, ApprovalStatus.REJECTED);
        emailService.sendRejectionEmail(advertiser.getEmail(), advertiser.getFullName(), "Advertiser");
        return advertiser;
    }
}
