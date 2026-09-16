package com.krupalu.MetalApp.services.impl;

import com.krupalu.MetalApp.dto.BuyerItemRequest;
import com.krupalu.MetalApp.entity.BuyerRequest;
import com.krupalu.MetalApp.entity.ProductPost;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.repo.BuyerRequestRepository;
import com.krupalu.MetalApp.repo.ProductPostRepository;
import com.krupalu.MetalApp.repo.UserRepository;
import com.krupalu.MetalApp.services.BuyerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BuyerServiceImpl implements BuyerService {

    private final UserRepository userRepository;
    private final BuyerRequestRepository buyerRequestRepository;

    @Override
    public List<BuyerItemRequest> getAllRequestedItems(String buyerId) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found with id: " + buyerId));

        return buyerRequestRepository.findByBuyer(buyer).stream()
                .map(req -> {
                    ProductPost product = req.getProductPost();
                    User seller = product.getUser();

                    return BuyerItemRequest.builder()
                            .productId(product.getId())
                            .title(product.getProductName())
                            .description(product.getDescription())
                            .status(req.getStatus().name())
                            .sellerName(seller != null ? seller.getFullName() : null)
                            .build();
                })
                .toList();
    }

}
