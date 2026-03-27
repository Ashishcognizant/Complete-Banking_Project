package com.cts.notification.controller;

import com.cts.notification.dto.*;
import com.cts.notification.model.Notification;
import com.cts.notification.repository.NotificationRepository;
import com.cts.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> myNotifications(
            @RequestParam Long userId) {
        var list = notificationService.listForUser(userId).stream()
                .map(notificationService::toResponse)
                .toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByUserId(@PathVariable Long userId) {
        var list = notificationService.listForUser(userId).stream()
                .map(notificationService::toResponse)
                .toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.unreadCount(userId));
    }

    @GetMapping("/test/all")
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationRepository.findAll());
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markRead(@PathVariable Long id) {
        var saved = notificationService.markRead(id);
        return ResponseEntity.ok(notificationService.toResponse(saved));
    }

    @PostMapping("/admin/send")
    public ResponseEntity<?> send(
            @Valid @RequestBody SendNotificationRequest req,
            jakarta.servlet.http.HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        if (!"ADMIN".equals(role) && !"OFFICER".equals(role)) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "You are not authorized to access this resource"));
        }
        var saved = notificationService.create(req.getUserId(), req.getMessage());
        return ResponseEntity.ok(notificationService.toResponse(saved));
    }

    @GetMapping("/admin/users/{userId}")
    public ResponseEntity<?> listForUser(
            @PathVariable Long userId,
            jakarta.servlet.http.HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        if (!"ADMIN".equals(role) && !"OFFICER".equals(role)) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "You are not authorized to access this resource"));
        }
        var list = notificationService.listForUser(userId).stream()
                .map(notificationService::toResponse)
                .toList();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/internal/create")
    public ResponseEntity<Void> createNotification(@RequestBody Map<String, Object> request) {
        Long userId = ((Number) request.get("userId")).longValue();
        String message = (String) request.get("message");
        notificationService.create(userId, message);
        return ResponseEntity.ok().build();
    }
}
