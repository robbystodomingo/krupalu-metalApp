package com.krupalu.MetalApp.controller;

import com.krupalu.MetalApp.entity.ProductCategory;
import com.krupalu.MetalApp.services.ProductCategoryService;
import com.krupalu.MetalApp.services.impl.ProductCategoryServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sellerDashboard/categories")
@RequiredArgsConstructor
@CrossOrigin
public class ProductCategoryController {
    private final ProductCategoryService categoryService;

    @GetMapping
    public List<ProductCategory> getAllCategories() {
        return categoryService.getAllCategories();
    }
}

