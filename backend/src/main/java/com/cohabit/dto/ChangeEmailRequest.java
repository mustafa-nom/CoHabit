package com.cohabit.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangeEmailRequest {
    @NotBlank(message = "New email is required")
    @Email(message = "Email must be valid")
    private String newEmail;
}
