package com.aios.core.auth;

import com.aios.core.auth.AuthDtos.AuthResponse;
import com.aios.core.auth.AuthDtos.LoginRequest;
import com.aios.core.auth.AuthDtos.SignupRequest;
import com.aios.core.global.exception.ApiException;
import com.aios.core.global.security.JwtService;
import com.aios.core.user.AppUser;
import com.aios.core.user.UserDtos.UserResponse;
import com.aios.core.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Email is already registered");
        }
        AppUser user = new AppUser();
        user.setEmail(email);
        user.setName(request.name().trim());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        users.save(user);
        return new AuthResponse(jwtService.createToken(user.getId(), user.getEmail()), UserResponse.from(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        AppUser user = users.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("bad credentials"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("bad credentials");
        }
        return new AuthResponse(jwtService.createToken(user.getId(), user.getEmail()), UserResponse.from(user));
    }
}
