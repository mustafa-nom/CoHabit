package com.cohabit.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HandleJoinRequestRequest {
    @NotNull(message = "Request ID is required")
    private Long requestId;

    @NotNull(message = "Accept status is required")
    private Boolean accept;
}