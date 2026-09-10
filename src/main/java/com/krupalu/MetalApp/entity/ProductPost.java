package com.krupalu.MetalApp.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.krupalu.MetalApp.enums.ApprovalStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "product_posts")
@ToString(onlyExplicitlyIncluded = true)
public class ProductPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ToString.Include
    private Long id;

    @ToString.Include
    private String productName;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @ElementCollection
    @CollectionTable(name = "product_post_photo_urls",
            joinColumns = @JoinColumn(name = "product_post_id"))
    @Column(name = "photo_urls")
    private List<String> photoUrls;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private ProductCategory category; // excluded from toString

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;
}
