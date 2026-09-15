package com.krupalu.MetalApp.dto;

import com.krupalu.MetalApp.enums.ApprovalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class ProductPostRequest {

        private Long id;
        private String productName;
        private String description;
        private ApprovalStatus approvalStatus;
        private List<String> photoUrls;
        private String categoryName;
        private String sellerName;
        private String sellerEmail;
        private String sellerPhoneNumber;
        private String userId;

}
