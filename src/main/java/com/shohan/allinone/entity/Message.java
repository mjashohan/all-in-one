package com.shohan.allinone.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_name", length = 100)
    private String senderName;

    @Column(name = "sender_email", length = 100)
    private String senderEmail;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "sent_at", updatable = false)
    @Builder.Default
    private LocalDateTime sentAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (sentAt == null) sentAt = LocalDateTime.now();
    }
}
