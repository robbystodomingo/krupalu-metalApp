package com.krupalu.MetalApp.services;

import com.krupalu.MetalApp.dto.ProductPostRequest;
import java.util.List;

public interface ProductPostViewService {
    List<ProductPostRequest> getApprovedPostsBySeller(String sellerId);
}
