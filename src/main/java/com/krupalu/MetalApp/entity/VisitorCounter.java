package com.krupalu.MetalApp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "visitor_counter")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitorCounter {
    @Id
    private Long id;

    private Long count;
}