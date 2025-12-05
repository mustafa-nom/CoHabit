package com.cohabit.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "members", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"household_id", "user_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private MemberRole role = MemberRole.MEMBER;

    @Column(name = "joined_at", updatable = false)
    private LocalDateTime joinedAt;

    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
    }

    public enum MemberRole {
        // FIX: Changed HOST to OWNER to match MySQL ENUM('MEMBER', 'ADMIN', 'OWNER')
        OWNER, 
        MEMBER
        // You can add ADMIN here if you want to support that role later
    }
}