package com.krupalu.MetalApp.repo;

import com.krupalu.MetalApp.entity.AdvertisementPost;
import com.krupalu.MetalApp.entity.ProductPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdvertisementPostRepository extends JpaRepository<AdvertisementPost, Long> {

    List<AdvertisementPost> findByUserId(String userId);
}
