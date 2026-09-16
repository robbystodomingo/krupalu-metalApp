package com.krupalu.MetalApp.entity;

import com.krupalu.MetalApp.enums.RequestStatus;
import com.krupalu.MetalApp.util.CustomIdGenerator;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "buyer_request")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuyerRequest {

    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne
    @JoinColumn(name = "product_post_id", nullable = false)
    private ProductPost productPost;

    private LocalDateTime requestedAt;

    @Enumerated(EnumType.STRING)
    private RequestStatus status; // e.g. SENT, APPROVED, REJECTED

    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = CustomIdGenerator.generateId();
        }
        if (this.requestedAt == null) {
            this.requestedAt = LocalDateTime.now();
        }
    }
}
