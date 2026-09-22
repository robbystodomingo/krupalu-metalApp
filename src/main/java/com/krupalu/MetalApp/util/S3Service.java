package com.krupalu.MetalApp.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.time.Duration;

@Component
public class S3Service {

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.region}")
    private String region;

    private S3Client s3Client;
    private S3Presigner presigner;

    private S3Client getClient() {
        if (s3Client == null) {
            s3Client = S3Client.builder().region(Region.of(region)).build();
        }
        return s3Client;
    }

    private S3Presigner getPresigner() {
        if (presigner == null) {
            presigner = S3Presigner.builder().region(Region.of(region)).build();
        }
        return presigner;
    }

    public String upload(MultipartFile file, String key) throws IOException {
        getClient().putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .contentType(file.getContentType())
                        .build(),
                RequestBody.fromInputStream(file.getInputStream(), file.getSize())
        );
        return key; // store just the key in the DB
    }

    public String getPresignedUrl(String key) {
        if (key == null || key.isBlank()) return null;

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(15))
                .getObjectRequest(getObjectRequest)
                .build();

        return getPresigner().presignGetObject(presignRequest).url().toString();
    }

    public void delete(String key) {
        getClient().deleteObject(
                DeleteObjectRequest.builder().bucket(bucketName).key(key).build()
        );
    }
}