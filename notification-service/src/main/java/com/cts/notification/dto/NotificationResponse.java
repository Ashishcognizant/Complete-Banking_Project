package com.cts.notification.dto;

import com.cts.notification.model.NotificationStatus;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private Long notificationId;
    private Long userId;
    private String message;
    private NotificationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}
