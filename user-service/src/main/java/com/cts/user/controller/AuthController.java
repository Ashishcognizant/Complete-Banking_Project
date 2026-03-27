package com.cts.user.controller;

import com.cts.user.dto.*;
import com.cts.user.exception.ResourceNotFoundException;
import com.cts.user.model.User;
import com.cts.user.repository.UserRepository;
import com.cts.user.security.JwtService;
import com.cts.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest req) {
        var created = userService.register(req);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new ResourceNotFoundException("Invalid email or password");
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                Map.of("role", user.getRole().name(), "uid", user.getId()));

        return ResponseEntity.ok(new AuthResponse("Bearer", token, jwtService.getExpirationSeconds()));
    }
}
