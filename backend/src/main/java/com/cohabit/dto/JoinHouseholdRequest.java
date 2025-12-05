package com.cohabit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JoinHouseholdRequest {
    @NotBlank(message = "Invite code is required")
    @Size(min = 6, max = 6, message = "Invite code must be exactly 6 characters")
    @Pattern(regexp = "^[A-Z0-9]{6}$", message = "Invite code must be 6 alphanumeric characters")
    private String inviteCode;
}