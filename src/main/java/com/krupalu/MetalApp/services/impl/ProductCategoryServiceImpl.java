package com.krupalu.MetalApp.services.impl;

import com.krupalu.MetalApp.entity.ProductCategory;
import com.krupalu.MetalApp.repo.ProductCategoryRepository;
import com.krupalu.MetalApp.services.ProductCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductCategoryServiceImpl implements ProductCategoryService {

    private final ProductCategoryRepository categoryRepository;

    public List<ProductCategory> getAllCategories() {
        return categoryRepository.findAll();
    }
}
