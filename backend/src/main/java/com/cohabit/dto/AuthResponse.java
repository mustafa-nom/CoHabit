package com.cohabit.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long userId;
    private String username;
    private String displayName;

    public AuthResponse(String token, Long userId, String username, String displayName) {
        this.token = token;
        this.type = "Bearer";
        this.userId = userId;
        this.username = username;
        this.displayName = displayName;
    }
}