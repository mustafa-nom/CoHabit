package com.cohabit.controller;

import com.cohabit.dto.ApiResponse;
import com.cohabit.dto.AuthResponse;
import com.cohabit.dto.LoginRequest;
import com.cohabit.dto.RegisterRequest;
import com.cohabit.service.AuthService;
import com.cohabit.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest) {
        AuthResponse response = authService.register(request, httpRequest);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {
        AuthResponse response = authService.login(request, httpRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            Authentication authentication,
            HttpServletRequest httpRequest) {
        Long userId = (Long) authentication.getPrincipal();
        authService.logout(userId, httpRequest);
        return ResponseEntity.ok(ApiResponse.success("Logout successful"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();

        // In a production system, you might want to get the user from the database
        // and regenerate the token. For now, we'll just validate the current token
        // is still valid and return user info.

        // This is a simplified implementation - in production you'd want to
        // implement proper refresh token logic

        return ResponseEntity.ok(
                ApiResponse.success("Token is still valid", null));
    }
}
