package com.cohabit.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "total_xp")
    private Integer totalXp = 0;

    private Integer level = 1;

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

    /**
     * Calculate user level based on total XP
     * Level formula: Level = floor(sqrt(totalXp / 100)) + 1
     * 
     * XP Thresholds:
     * Level 1: 0-99 XP
     * Level 2: 100-399 XP
     * Level 3: 400-899 XP
     * Level 4: 900-1599 XP
     * Level 5: 1600-2499 XP
     * etc.
     */
    public void updateLevel() {
        if (totalXp == null || totalXp < 0) {
            this.level = 1;
            return;
        }
        this.level = (int) Math.floor(Math.sqrt(totalXp / 100.0)) + 1;
    }

    /**
     * Add XP to user and recalculate level
     */
    public void addXp(int xp) {
        if (this.totalXp == null) {
            this.totalXp = 0;
        }
        this.totalXp += xp;
        updateLevel();
    }
}
