package com.cts.user.repository;

import com.cts.user.model.AuthToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface AuthTokenRepository extends JpaRepository<AuthToken, Long> {
    Optional<AuthToken> findByToken(String token);
    void deleteByExpiresAtBefore(LocalDateTime now);
}
