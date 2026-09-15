package com.krupalu.MetalApp.services.impl;

import com.krupalu.MetalApp.dto.ProductPostRequest;
import com.krupalu.MetalApp.entity.ProductPost;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.enums.ApprovalStatus;
import com.krupalu.MetalApp.repo.ProductPostRepository;
import com.krupalu.MetalApp.services.ProductPostService;
import com.krupalu.MetalApp.services.ProductPostViewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductPostViewServiceImpl implements ProductPostViewService {

    private final ProductPostRepository postRepository;

    public ProductPostViewServiceImpl(ProductPostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    public List<ProductPostRequest> getApprovedPostsBySeller(String sellerId) {
        List<ProductPost> posts = postRepository.findByUser_IdAndApprovalStatus(
                sellerId, ApprovalStatus.APPROVED
        );

        System.out.println("Fetching approved posts for sellerId=" + sellerId);
        System.out.println("Found posts count=" + posts.size());

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





    private String rewritePath(String localPath) {
        String baseUrl = "http://localhost:8082/uploads";

        // Normalize both forward and backward slashes
        String relativePath = localPath
                .replace("D:/uploads", "")
                .replace("D:\\uploads", "")
                .replace("\\", "/");

        // Ensure no accidental double slashes
        if (relativePath.startsWith("/")) {
            return baseUrl + relativePath;
        } else {
            return baseUrl + "/" + relativePath;
        }
    }

}