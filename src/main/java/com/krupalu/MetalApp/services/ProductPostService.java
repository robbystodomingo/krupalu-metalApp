package com.krupalu.MetalApp.services;

import com.krupalu.MetalApp.dto.ProductPostRequest;
import com.krupalu.MetalApp.entity.ProductPost;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductPostService {

    @Transactional
    public ProductPost createPost(String userId, String productName,
                                  Long categoryId, String description,
                                  List<MultipartFile> photos) throws IOException;

    List<ProductPostRequest> getAllPostings();

    ProductPostRequest getPostById(Long id, String userId);

    void deletePost(Long postId, String userId) throws IOException;

    @Transactional
    ProductPost updatePost(Long postId, String userId,
                           String productName, Long categoryId,
                           String description, List<MultipartFile> photos) throws IOException;


}
