package com.cohabit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardResponse {
    private Long userId;
    private String displayName;
    private String username;
    private Integer totalXp;
    private Integer level;
    private Integer rank;
    private Integer tasksCompleted;
}

