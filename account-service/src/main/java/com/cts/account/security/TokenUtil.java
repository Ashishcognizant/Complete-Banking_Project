package com.cts.account.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.Map;

@Component
public class TokenUtil {
    private final RestTemplate restTemplate = new RestTemplate();
    
    @Value("${user.service.url:http://localhost:8081}")
    private String userServiceUrl;

    public Map<String, String> validateToken(String token) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                userServiceUrl + "/api/users/me",
                HttpMethod.GET,
                entity,
                Map.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                return Map.of(
                    "email", body.get("email").toString(),
                    "role", body.get("role").toString()
                );
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }
}
