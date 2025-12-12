package com.cohabit.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTaskRequest {

    @Size(min = 1, max = 200, message = "Task title must be between 1 and 200 characters")
    private String title;

    @Size(max = 5000, message = "Description cannot exceed 5000 characters")
    private String description;

    private LocalDateTime dueDate;

    private String recurrenceRule; // NONE, DAILY, WEEKLY, MONTHLY, CUSTOM

    private String difficulty; // EASY, MEDIUM, HARD

    @Size(max = 50, message = "Estimated time cannot exceed 50 characters")
    private String estimatedTime;
}

