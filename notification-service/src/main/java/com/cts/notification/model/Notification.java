package com.cts.notification.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 12)
    private NotificationStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime readAt;
}
