package com.krupalu.MetalApp.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "advertisement_posts")
@ToString(onlyExplicitlyIncluded = true)
public class AdvertisementPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ToString.Include
    private Long id;

    @ToString.Include
    private String advertisementName;

    @Column(length = 1000)
    private String description;

    @ElementCollection
    @CollectionTable(name = "advertisement_post_photo_urls",
            joinColumns = @JoinColumn(name = "advertisement_post_id"))
    @Column(name = "photo_urls")
    private List<String> photoUrls;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;
}
