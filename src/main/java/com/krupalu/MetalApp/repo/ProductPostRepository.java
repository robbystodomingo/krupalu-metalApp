package com.krupalu.MetalApp.repo;

import com.krupalu.MetalApp.dto.ProductPostRequest;
import com.krupalu.MetalApp.entity.ProductCategory;
import com.krupalu.MetalApp.entity.ProductPost;
import com.krupalu.MetalApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductPostRepository extends JpaRepository<ProductPost, Long> {
    List<ProductPost> findByCategory(ProductCategory category);

    List<ProductPost> findByUserId(String userId);
}
