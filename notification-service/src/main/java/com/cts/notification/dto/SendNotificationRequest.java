package com.cts.notification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendNotificationRequest {
    @NotNull(message = "userId is required")
    private Long userId;

    @NotBlank(message = "message is required")
    private String message;
}
