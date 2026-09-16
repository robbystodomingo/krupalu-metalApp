package com.krupalu.MetalApp.util;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Component
public class PhotoUrlResolver {

    public String resolve(String storedPath) {
        if (storedPath == null) return null;

        String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .build()
                .toUriString();

        String relativePath = storedPath
                .replaceAll("^[A-Za-z]:[/\\\\]", "/")
                .replace("\\", "/");

        if (!relativePath.startsWith("/")) {
            relativePath = "/" + relativePath;
        }

        relativePath = relativePath.replaceAll("(?<!:)/{2,}", "/");

        return baseUrl + relativePath;
    }
}