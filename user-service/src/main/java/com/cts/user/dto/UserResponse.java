package com.cts.user.dto;

import com.cts.user.model.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long userId;
    private String name;
    private Role role;
    private String email;
    private String phone;
}
