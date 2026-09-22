package com.krupalu.MetalApp.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class PhotoUrlResolver {

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.region}")
    private String region;

    public String resolve(String storedKey) {
        if (storedKey == null) return null;
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, storedKey);
    }
}