package com.cohabit.controller;

import com.cohabit.dto.*;
import com.cohabit.service.HouseholdService;
import com.cohabit.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/household")
@RequiredArgsConstructor
public class HouseholdController {

    private final HouseholdService householdService;
    private final JwtUtil jwtUtil;

    /**
     * Get current user's household
     * Returns null/empty if user is not in a household
     */
    @GetMapping("/current")
    public ResponseEntity<ApiResponse<HouseholdResponse>> getCurrentHousehold(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        HouseholdResponse household = householdService.getCurrentHousehold(userId);

        if (household == null) {
            return ResponseEntity.ok(ApiResponse.success("Currently not in a group", null));
        }

        return ResponseEntity.ok(ApiResponse.success("Household retrieved successfully", household));
    }

    /**
     * Create a new household
     */
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<HouseholdResponse>> createHousehold(
            @Valid @RequestBody CreateHouseholdRequest createRequest,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        HouseholdResponse household = householdService.createHousehold(createRequest, userId);
        return ResponseEntity.ok(ApiResponse.success("Household Created!", household));
    }

    /**
     * Find household by invite code (preview before joining)
     */
    @GetMapping("/find/{inviteCode}")
    public ResponseEntity<ApiResponse<HouseholdPreviewResponse>> findHousehold(
            @PathVariable String inviteCode) {
        HouseholdPreviewResponse preview = householdService.findByInviteCode(inviteCode);
        return ResponseEntity.ok(ApiResponse.success("Household found", preview));
    }

    /**
     * Request to join a household
     */
    @PostMapping("/join/{householdId}")
    public ResponseEntity<ApiResponse<Void>> requestToJoin(
            @PathVariable Long householdId,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        householdService.requestToJoin(householdId, userId);
        return ResponseEntity.ok(ApiResponse.success("Request Sent!", null));
    }

    /**
     * Get pending join requests (host only)
     */
    @GetMapping("/{householdId}/requests")
    public ResponseEntity<ApiResponse<List<HouseholdResponse.JoinRequestInfo>>> getPendingRequests(
            @PathVariable Long householdId,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        List<HouseholdResponse.JoinRequestInfo> requests = householdService.getPendingRequests(householdId, userId);
        return ResponseEntity.ok(ApiResponse.success("Pending requests retrieved", requests));
    }

    /**
     * Handle join request (accept or reject) - host only
     */
    @PostMapping("/requests/handle")
    public ResponseEntity<ApiResponse<Void>> handleJoinRequest(
            @Valid @RequestBody HandleJoinRequestRequest handleRequest,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        householdService.handleJoinRequest(handleRequest.getRequestId(), handleRequest.getAccept(), userId);

        String message = handleRequest.getAccept() ? "Request accepted" : "Request rejected";
        return ResponseEntity.ok(ApiResponse.success(message, null));
    }

    /**
     * Leave current household
     */
    @PostMapping("/leave")
    public ResponseEntity<ApiResponse<Void>> leaveHousehold(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        householdService.leaveHousehold(userId);
        return ResponseEntity.ok(ApiResponse.success("You have left the household", null));
    }

    /**
     * Extract user ID from JWT token in request
     */
    private Long getUserIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        throw new RuntimeException("Authorization header missing or invalid");
    }
}