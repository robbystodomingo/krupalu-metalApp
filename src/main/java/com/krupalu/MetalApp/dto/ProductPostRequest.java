package com.krupalu.MetalApp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ProductPostRequest {

        private Long id;
        private String productName;
        private String description;
        private List<String> photoUrls;
        private String categoryName;

}
