package com.cts.notification.service;

import com.cts.notification.dto.NotificationResponse;
import com.cts.notification.model.Notification;
import com.cts.notification.model.NotificationStatus;
import com.cts.notification.repository.NotificationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    @Transactional
    public Notification create(Long userId, String message) {
        Notification n = Notification.builder()
                .userId(userId)
                .message(message)
                .status(NotificationStatus.NEW)
                .createdAt(LocalDateTime.now())
                .build();
        return notificationRepository.save(n);
    }

    public List<Notification> listForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long unreadCount(Long userId) {
        return notificationRepository.countByUserIdAndStatus(userId, NotificationStatus.NEW);
    }

    @Transactional
    public Notification markRead(Long notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found: " + notificationId));
        if (n.getStatus() != NotificationStatus.READ) {
            n.setStatus(NotificationStatus.READ);
            n.setReadAt(LocalDateTime.now());
        }
        return notificationRepository.save(n);
    }

    public NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .notificationId(n.getNotificationId())
                .userId(n.getUserId())
                .message(n.getMessage())
                .status(n.getStatus())
                .createdAt(n.getCreatedAt())
                .readAt(n.getReadAt())
                .build();
    }
}
