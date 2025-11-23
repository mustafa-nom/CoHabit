package com.cohabit.controller;

import com.cohabit.dto.*;
import com.cohabit.model.User;
import com.cohabit.model.VerificationCode;
import com.cohabit.service.EmailService;
import com.cohabit.service.UserService;
import com.cohabit.service.VerificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    @Autowired
    private VerificationService verificationService;

    @Autowired
    private EmailService emailService;

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

    @PostMapping("/change-email/request")
    public ResponseEntity<ApiResponse<Map<String, String>>> requestEmailChange(
            @Valid @RequestBody ChangeEmailRequest request,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();

        // Generate verification code
        VerificationCode verificationCode = verificationService.createVerificationCode(request.getNewEmail());

        // Send email (mock - will log the code)
        emailService.sendVerificationEmail(request.getNewEmail(), verificationCode.getCode());

        // Return the verification code in the response for testing
        Map<String, String> data = new HashMap<>();
        data.put("message", "Verification code sent to " + request.getNewEmail());
        data.put("verificationCode", verificationCode.getCode()); // For testing only - remove in production!

        return ResponseEntity.ok(ApiResponse.success(
                "Verification code sent. Please check your email.", data));
    }

    @PostMapping("/change-email/verify")
    public ResponseEntity<ApiResponse<User>> verifyEmailChange(
            @Valid @RequestBody VerifyEmailRequest request,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();

        // Validate verification code
        verificationService.validateAndUseCode(request.getCode(), request.getEmail());

        // Update email
        User updatedUser = userService.changeEmail(userId, request.getEmail());

        // Mark email as verified
        updatedUser = userService.verifyEmail(userId);

        return ResponseEntity.ok(ApiResponse.success("Email updated successfully", updatedUser));
    }
}
