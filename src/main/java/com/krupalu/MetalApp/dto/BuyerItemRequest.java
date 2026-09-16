package com.krupalu.MetalApp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BuyerItemRequest {

    private Long productId;
    private String sellerName;
    private String title;
    private String description;
    private String status;
}
