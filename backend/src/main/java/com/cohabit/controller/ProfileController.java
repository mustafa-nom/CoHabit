package com.cohabit.controller;

import com.cohabit.dto.*;
import com.cohabit.model.User;
import com.cohabit.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }

    @PutMapping("/display-name")
    public ResponseEntity<ApiResponse<User>> changeDisplayName(
            @Valid @RequestBody ChangeDisplayNameRequest request,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        User updatedUser = userService.changeDisplayName(userId, request.getNewDisplayName());
        return ResponseEntity.ok(ApiResponse.success("Display name updated successfully", updatedUser));
    }

    @PutMapping("/username")
    public ResponseEntity<ApiResponse<User>> changeUsername(
            @Valid @RequestBody ChangeUsernameRequest request,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        User updatedUser = userService.changeUsername(userId, request.getNewUsername());
        return ResponseEntity.ok(ApiResponse.success("Username updated successfully", updatedUser));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        userService.changePassword(userId, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }
}
