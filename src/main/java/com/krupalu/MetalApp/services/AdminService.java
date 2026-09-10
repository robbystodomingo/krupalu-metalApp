package com.krupalu.MetalApp.services;

import com.krupalu.MetalApp.entity.AdvertisementPost;
import com.krupalu.MetalApp.entity.ProductPost;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.enums.ApprovalStatus;

import java.util.List;

public interface AdminService {

    public List<User> getPendingBuyers();

    public User updateBuyerApproval(String userId, ApprovalStatus status);

    public List<ProductPost> getPendingProducts();

    public ProductPost updateProductApproval(Long productId, ApprovalStatus status);

    public List<AdvertisementPost> getPendingAdvertisements();

    public AdvertisementPost updateAdvertisementApproval(Long adId, ApprovalStatus status);

    public User approveBuyer(String userId);

    public User rejectBuyer(String userId);

    public ProductPost approveProduct(Long productId);

    public ProductPost rejectProduct(Long productId);

    public AdvertisementPost approveAdvertisement(Long adId);

    public AdvertisementPost rejectAdvertisement(Long adId);


}
