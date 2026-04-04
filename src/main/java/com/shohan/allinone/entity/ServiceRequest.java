package com.shohan.allinone.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "service_requests")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "service_type", length = 100)
    private String serviceType;

    @Column(length = 50)
    @Builder.Default
    private String status = "PENDING";

    @Column(columnDefinition = "TEXT")
    private String description;

    @PrePersist
    protected void onCreate() {
        if (status == null) status = "PENDING";
    }
}
