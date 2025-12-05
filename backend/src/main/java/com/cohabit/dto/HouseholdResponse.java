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
public class HouseholdResponse {
    private Long id;
    private String name;
    private String inviteCode;
    private String address;
    private String description;
    private int memberCount;
    private Long hostId;
    private String hostDisplayName;
    private List<MemberInfo> members;
    private List<JoinRequestInfo> pendingRequests;
    
    // Added field
    private String currentUserRole;

    private boolean isHost;
    private LocalDateTime createdAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MemberInfo {
        private Long userId;
        private String displayName;
        private String username;
        private String role;
        private LocalDateTime joinedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JoinRequestInfo {
        private Long requestId;
        private Long userId;
        private String displayName;
        private String username;
        private LocalDateTime requestedAt;
    }
}