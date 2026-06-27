package com.aios.core.auth;

import com.aios.core.user.UserDtos.UserResponse;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {
    public record SignupRequest(
            @Email @NotBlank String email,
            @NotBlank @Size(min = 8) String password,
            @NotBlank String name
    ) {}

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {}

    public record AuthResponse(String accessToken, UserResponse user) {}
}
