package com.cts.account.client;

public class NotificationRequest {
    public Long userId;
    public String message;

    public NotificationRequest() {}

    public NotificationRequest(Long userId, String message) {
        this.userId = userId;
        this.message = message;
    }
}
