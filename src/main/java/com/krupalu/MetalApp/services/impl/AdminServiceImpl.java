package com.krupalu.MetalApp.services.impl;

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
        User buyer = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
        buyer.setApprovalStatus(status);
        return userRepository.save(buyer);
    }

    @Override
    public List<ProductPost> getPendingProducts() {
        return productPostRepository.findByApprovalStatus(ApprovalStatus.PENDING);
    }

    @Override
    public ProductPost updateProductApproval(Long productId, ApprovalStatus status) {
        ProductPost product = productPostRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setApprovalStatus(status);
        return productPostRepository.save(product);
    }

    @Override
    public List<AdvertisementPost> getPendingAdvertisements() {
        return advertisementPostRepository.findByApprovalStatus(ApprovalStatus.PENDING);
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
}
