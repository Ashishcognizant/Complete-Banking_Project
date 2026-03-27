package com.cts.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserRequest {
    private String name;

    @Email(message = "Please provide a valid email address")
    private String email;

    @Size(min = 10, max = 10, message = "Phone number must be exactly 10 digits")
    private String phone;

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}
