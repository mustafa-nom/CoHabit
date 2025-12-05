package com.cohabit.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdPreviewResponse {
    private Long id;
    private String name;
    private String description;
    private int memberCount;
    private String hostDisplayName;
}