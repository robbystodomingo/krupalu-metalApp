package com.krupalu.MetalApp.util;

public class CustomIdGenerator {

    public static String generateId() {
        String prefix = "41";
        long timestamp = System.currentTimeMillis();
        // take last 10 digits of timestamp for compactness
        String uniquePart = String.valueOf(timestamp)
                .substring(Math.max(0, String.valueOf(timestamp).length() - 10));
        return prefix + uniquePart;
    }
}

