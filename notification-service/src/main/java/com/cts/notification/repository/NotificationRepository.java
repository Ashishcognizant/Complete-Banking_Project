package com.cts.notification.repository;

import com.cts.notification.model.Notification;
import com.cts.notification.model.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserIdAndStatus(Long userId, NotificationStatus status);
}
