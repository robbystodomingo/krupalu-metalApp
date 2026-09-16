package com.krupalu.MetalApp.services.impl;

import com.krupalu.MetalApp.dto.ProductPostRequest;
import com.krupalu.MetalApp.entity.ProductPost;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.enums.ApprovalStatus;
import com.krupalu.MetalApp.repo.ProductPostRepository;
import com.krupalu.MetalApp.services.ProductPostService;
import com.krupalu.MetalApp.services.ProductPostViewService;
import com.krupalu.MetalApp.util.PhotoUrlResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductPostViewServiceImpl implements ProductPostViewService {

    private final ProductPostRepository postRepository;

    private final PhotoUrlResolver photoUrlResolver;

    @Override
    public List<ProductPostRequest> getApprovedPostsBySeller(String sellerId) {
        List<ProductPost> posts = postRepository.findByUser_IdAndApprovalStatus(
                sellerId, ApprovalStatus.APPROVED
        );

        return posts.stream()
                .map(p -> {
                    User seller = p.getUser();
                    List<String> rewrittenUrls = p.getPhotoUrls() != null
                            ? p.getPhotoUrls().stream()
                            .map(photoUrlResolver::resolve)
                            .toList()
                            : List.of();
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

}