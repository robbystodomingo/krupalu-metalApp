package com.krupalu.MetalApp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class AdvertisementPostRequest {

    private Long id;
    private String advertisementName;
    private String description;
    private List<String> photoUrls;
}
