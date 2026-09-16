package com.krupalu.MetalApp.services;

import com.krupalu.MetalApp.dto.BuyerItemRequest;
import com.krupalu.MetalApp.entity.ProductPost;

import java.util.List;

public interface BuyerService {
    List<BuyerItemRequest> getAllRequestedItems(String id);
}
