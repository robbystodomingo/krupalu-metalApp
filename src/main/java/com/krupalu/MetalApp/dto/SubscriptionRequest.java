package com.krupalu.MetalApp.dto;

import lombok.Data;

@Data
public class SubscriptionRequest {

    private String customerId;

    private String paymentType;
}
