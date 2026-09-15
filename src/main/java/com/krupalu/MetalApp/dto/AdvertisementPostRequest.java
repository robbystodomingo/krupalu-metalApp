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
public class AdvertisementPostRequest {

    private Long id;
    private String advertisementName;
    private String description;
    private ApprovalStatus approvalStatus;
    private List<String> photoUrls;
    private String advertiserName;
    private String advertiserEmail;
    private String advertiserPhoneNumber;
    private String userId;
}
