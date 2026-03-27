package com.cts.user.service;

import com.cts.user.dto.RegisterRequest;
import com.cts.user.dto.UpdateUserRequest;
import com.cts.user.dto.UserResponse;
import com.cts.user.exception.DuplicateResourceException;
import com.cts.user.exception.ResourceNotFoundException;
import com.cts.user.model.User;
import com.cts.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repo;
    private final BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse register(RegisterRequest req) {
        if (repo.existsByEmail(req.getEmail().toLowerCase())) {
            throw new DuplicateResourceException("Email already registered");
        }
        if (repo.existsByPhone(req.getPhone())) {
            throw new DuplicateResourceException("Phone number already registered");
        }
        if (req.getPhone().length() != 10) {
            throw new IllegalArgumentException("Phone number must be exactly 10 digits");
        }
        User user = User.builder()
                .name(req.getName())
                .role(req.getRole())
                .email(req.getEmail().toLowerCase())
                .phone(req.getPhone())
                .password(passwordEncoder.encode(req.getPassword()))
                .build();
        return toResponse(repo.save(user));
    }

    @Transactional
    public UserResponse updateUser(String email, UpdateUserRequest req) {
        User user = repo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + email));

        if (req.getName() != null && !req.getName().isBlank()) {
            user.setName(req.getName());
        }
        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            String newEmail = req.getEmail().toLowerCase();
            if (!newEmail.equals(email) && repo.existsByEmail(newEmail)) {
                throw new DuplicateResourceException("Email already registered");
            }
            user.setEmail(newEmail);
        }
        if (req.getPhone() != null && !req.getPhone().isBlank()) {
            if (req.getPhone().length() != 10) {
                throw new IllegalArgumentException("Phone number must be exactly 10 digits");
            }
            // Check if the new phone is already taken by another user
            repo.findAll().stream()
                    .filter(u -> u.getPhone().equals(req.getPhone()) && !u.getEmail().equals(user.getEmail()))
                    .findFirst()
                    .ifPresent(u -> {
                        throw new DuplicateResourceException("Phone number already registered");
                    });
            user.setPhone(req.getPhone());
        }
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }

        return toResponse(repo.save(user));
    }

    public UserResponse toResponse(User u) {
        return new UserResponse(u.getId(), u.getName(), u.getRole(), u.getEmail(), u.getPhone());
    }

    public List<UserResponse> listAll() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }
}
