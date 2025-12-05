package com.cohabit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateHouseholdRequest {
    @NotBlank(message = "Household name is required")
    @Size(min = 2, max = 100, message = "Household name must be between 2 and 100 characters")
    private String name;

    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
}