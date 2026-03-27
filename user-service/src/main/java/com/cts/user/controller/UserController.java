package com.cts.user.controller;

import com.cts.user.dto.UpdateUserRequest;
import com.cts.user.dto.UserResponse;
import com.cts.user.exception.AccessDeniedException;
import com.cts.user.exception.ResourceNotFoundException;
import com.cts.user.repository.UserRepository;
import com.cts.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(userService.toResponse(user));
    }

    @PatchMapping("/me")
    public ResponseEntity<UserResponse> updateMe(@Valid @RequestBody UpdateUserRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return ResponseEntity.ok(userService.updateUser(email, req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return ResponseEntity.ok(userService.toResponse(user));
    }

    @GetMapping("/internal/{id}")
    public ResponseEntity<UserResponse> getUserByIdInternal(@PathVariable Long id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return ResponseEntity.ok(userService.toResponse(user));
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> listAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
        if (!isAdmin) {
            throw new AccessDeniedException("You are not authorized to do this");
        }
        return ResponseEntity.ok(userService.listAll());
    }
}
