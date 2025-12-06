package com.cohabit.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {
    private Long id;
    private Long householdId;
    private String householdName;
    private String title;
    private String description;
    private String status; // OPEN, ASSIGNED, etc.
    private LocalDateTime dueDate;
    private String recurrenceRule; // NONE, DAILY, WEEKLY, MONTHLY, CUSTOM
    private Boolean rotateAssignments;
    private String estimatedTime;
    private Long createdByUserId;
    private String createdByDisplayName;
    private List<AssigneeInfo> assignees;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AssigneeInfo {
        private Long userId;
        private String displayName;
        private String username;
        private String assignmentStatus; // ACTIVE, SWAP_REQUESTED, etc.
        private LocalDateTime assignedAt;
    }
}
