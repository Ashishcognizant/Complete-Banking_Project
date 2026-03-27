package com.cts.user.security;

import com.cts.user.model.AuthToken;
import com.cts.user.repository.AuthTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final AuthTokenRepository tokenRepository;
    private static final int TOKEN_LENGTH = 32;
    private static final long EXPIRATION_HOURS = 1;

    public String generateToken(Long userId, String email, String role) {
        String token = generateRandomToken();
        
        AuthToken authToken = AuthToken.builder()
                .token(token)
                .userId(userId)
                .email(email)
                .role(role)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusHours(EXPIRATION_HOURS))
                .build();
        
        tokenRepository.save(authToken);
        return token;
    }

    public Optional<AuthToken> validateToken(String token) {
        Optional<AuthToken> authToken = tokenRepository.findByToken(token);
        if (authToken.isPresent() && authToken.get().getExpiresAt().isAfter(LocalDateTime.now())) {
            return authToken;
        }
        return Optional.empty();
    }

    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }

    private String generateRandomToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[TOKEN_LENGTH];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public long getExpirationSeconds() {
        return EXPIRATION_HOURS * 3600;
    }
}
