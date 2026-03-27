package com.cts.user.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "auth_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String token;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String role;
    
    @Column(nullable = false)
    private LocalDateTime expiresAt;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
}
