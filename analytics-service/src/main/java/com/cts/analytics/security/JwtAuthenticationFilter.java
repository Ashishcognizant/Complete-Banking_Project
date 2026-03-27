package com.cts.analytics.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendError(response, 401, "Authorization is required");
            return;
        }

        String token = authHeader.substring(7);
        
        if (token.isEmpty()) {
            sendError(response, 401, "Authorization is required");
            return;
        }

        try {
            if (!jwtUtil.validateToken(token)) {
                sendError(response, 401, "Invalid or expired token");
                return;
            }
            
            String role = jwtUtil.extractRole(token);
            String email = jwtUtil.extractEmail(token);
            
            request.setAttribute("userRole", role);
            request.setAttribute("userEmail", email);
            
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                email, null, List.of(new SimpleGrantedAuthority("ROLE_" + role))
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
        } catch (Exception e) {
            sendError(response, 401, "Invalid or expired token");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void sendError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write(String.format(
            "{\"timestamp\":\"%s\",\"status\":%d,\"error\":\"%s\",\"message\":\"%s\"}",
            java.time.LocalDateTime.now(), status, 
            status == 401 ? "Unauthorized" : "Forbidden", message
        ));
    }
}
