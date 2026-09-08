package com.krupalu.MetalApp.services;

import com.krupalu.MetalApp.dto.AdvertisementPostRequest;
import com.krupalu.MetalApp.dto.ProductPostRequest;
import com.krupalu.MetalApp.entity.AdvertisementPost;
import com.krupalu.MetalApp.entity.ProductPost;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface AdvertisementPostService {

    @Transactional
    public AdvertisementPost createAdvertisement(String userId, String advertisementName, String description,
                                                 List<MultipartFile> photos) throws IOException;

    List<AdvertisementPostRequest> getAllAdvertisements();

    AdvertisementPostRequest getAdvertisementById(Long id, String userId);

    void deleteAdvertisement(Long advertisementId, String userId) throws IOException;

    @Transactional
    AdvertisementPost updateAdvertisement(Long advertisementId, String userId,
                           String advertisementName, String description, List<MultipartFile> photos) throws IOException;
}
