package com.krupalu.MetalApp.services;

import com.krupalu.MetalApp.dto.AdvertisementPostRequest;
import com.krupalu.MetalApp.dto.ProductPostRequest;
import com.krupalu.MetalApp.entity.AdvertisementPost;
import com.krupalu.MetalApp.entity.ProductPost;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.enums.ApprovalStatus;

import java.util.List;

public interface AdminService {

    public List<User> getPendingBuyers();

    public List<User> getPendingSellers();

    public List<User> getPendingAdvertisers();

    public User updateBuyerApproval(String userId, ApprovalStatus status);

    public User updateSellerApproval(String userId, ApprovalStatus status);

    public User updateAdvertiserApproval(String userId, ApprovalStatus status);

    public List<ProductPostRequest> getPendingProducts();

    public ProductPost updateProductApproval(Long productId, ApprovalStatus status);

    public List<AdvertisementPostRequest> getPendingAdvertisements();

    public AdvertisementPost updateAdvertisementApproval(Long adId, ApprovalStatus status);

    public User approveBuyer(String userId);

    public User rejectBuyer(String userId);

    public User approveSeller(String userId);

    public User rejectSeller(String userId);

    public User approveAdvertiser(String userId);

    public User rejectAdvertiser(String userId);

    public ProductPost approveProduct(Long productId);

    public ProductPost rejectProduct(Long productId);

    public AdvertisementPost approveAdvertisement(Long adId);

    public AdvertisementPost rejectAdvertisement(Long adId);

    public User updateBuyerRequirement(String userId, String requirement);

    public User updateSellerRequirement(String userId, String requirement);

    public User updateAdvertiserRequirement(String userId, String requirement);


}
