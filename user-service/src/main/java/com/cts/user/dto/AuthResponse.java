package com.cts.user.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String tokenType;
    private String accessToken;
    private long expiresInSeconds;
}
