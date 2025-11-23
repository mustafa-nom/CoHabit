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
    private String email;
    private String username;
    private String displayName;

    public AuthResponse(String token, Long userId, String email, String username, String displayName) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.username = username;
        this.displayName = displayName;
    }
}
