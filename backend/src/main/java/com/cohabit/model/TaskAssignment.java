package com.cohabit.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "task_assignments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"task_id", "assignee_user_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_user_id", nullable = false)
    private User assignee;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private AssignmentStatus status = AssignmentStatus.ACTIVE;

    @PrePersist
    protected void onCreate() {
        assignedAt = LocalDateTime.now();
    }

    public enum AssignmentStatus {
        ACTIVE, SWAP_REQUESTED, SWAPPED, CANCELED
    }
}
