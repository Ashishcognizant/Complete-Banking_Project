package com.cts.user.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    private static final String SECRET_B64 = "TmV3U2VjcmV0S2V5Rm9ySldUU2lnbmluZ1B1cnBvc2VzMTIzNDU2Nzg";
    private static final long EXPIRATION_SECONDS = 60 * 60;

    private final Key key;

    public JwtService() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_B64);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String subject, Map<String, Object> claims) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(EXPIRATION_SECONDS)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractSubject(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return resolver.apply(claims);
    }

    public long getExpirationSeconds() {
        return EXPIRATION_SECONDS;
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
