package com.krupalu.MetalApp.repo;

import com.krupalu.MetalApp.entity.AdvertisementPost;
import com.krupalu.MetalApp.entity.ProductPost;
import com.krupalu.MetalApp.enums.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface AdvertisementPostRepository extends JpaRepository<AdvertisementPost, Long> {

    List<AdvertisementPost> findByUserId(String userId);

    List<AdvertisementPost> findByApprovalStatus(ApprovalStatus status);
}
