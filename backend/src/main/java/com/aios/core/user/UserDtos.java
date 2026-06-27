package com.aios.core.user;

import java.time.Instant;

public class UserDtos {
    public record UserResponse(Long id, String email, String name, Instant createdAt) {
        public static UserResponse from(AppUser user) {
            return new UserResponse(user.getId(), user.getEmail(), user.getName(), user.getCreatedAt());
        }
    }
}
