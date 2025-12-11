package com.cohabit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskRequest {

    @NotBlank(message = "Task title is required")
    @Size(min = 1, max = 200, message = "Task title must be between 1 and 200 characters")
    private String title;

    @Size(max = 5000, message = "Description cannot exceed 5000 characters")
    private String description;

    private LocalDateTime dueDate; // Optional

    private String recurrenceRule = "NONE"; // NONE, DAILY, WEEKLY, MONTHLY, CUSTOM

    private String difficulty = "MEDIUM"; // EASY, MEDIUM, HARD

    private List<Long> assigneeUserIds; // Optional, defaults to creator

    private Boolean rotateAssignments = false;

    @Size(max = 50, message = "Estimated time cannot exceed 50 characters")
    private String estimatedTime; // Optional, e.g., "30 minutes", "1 hour"
}
