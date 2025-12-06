package com.cohabit.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "difficulty", length = 20)
    private String difficulty = "MEDIUM";

    @Column(name = "xp_points")
    private Integer xpPoints = 20;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private TaskStatus status = TaskStatus.OPEN;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "recurrence_rule", length = 50)
    private RecurrenceRule recurrenceRule = RecurrenceRule.NONE;

    @Column(name = "is_free_for_all")
    private Boolean isFreeForAll = false;

    @Column(name = "rotate_assignments")
    private Boolean rotateAssignments = false;

    @Column(name = "estimated_time", length = 50)
    private String estimatedTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TaskAssignment> assignments = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TaskStatus {
        OPEN, ASSIGNED, IN_PROGRESS, COMPLETED, VERIFIED
    }

    public enum RecurrenceRule {
        NONE, DAILY, WEEKLY, MONTHLY, CUSTOM
    }
}
