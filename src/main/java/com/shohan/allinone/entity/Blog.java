package com.shohan.allinone.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "blogs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(length = 100)
    private String category;

    @Column(name = "published_date", updatable = false)
    @Builder.Default
    private LocalDateTime publishedDate = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (publishedDate == null) publishedDate = LocalDateTime.now();
    }
}
