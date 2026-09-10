package com.krupalu.MetalApp.repo;

import com.krupalu.MetalApp.dto.ProductPostRequest;
import com.krupalu.MetalApp.entity.ProductCategory;
import com.krupalu.MetalApp.entity.ProductPost;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.enums.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ProductPostRepository extends JpaRepository<ProductPost, Long> {
    List<ProductPost> findByCategory(ProductCategory category);

    List<ProductPost> findByUserId(String userId);

    List<ProductPost> findByApprovalStatus(ApprovalStatus status);

    List<ProductPost> findByUser_IdAndApprovalStatus(String userId, ApprovalStatus status);


}
