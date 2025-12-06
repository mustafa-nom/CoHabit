package com.cohabit.controller;

import com.cohabit.dto.ApiResponse;
import com.cohabit.dto.CreateTaskRequest;
import com.cohabit.dto.TaskResponse;
import com.cohabit.service.TaskService;
import com.cohabit.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final JwtUtil jwtUtil;

    /**
     * Create a new task
     * POST /tasks
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @Valid @RequestBody CreateTaskRequest request,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        TaskResponse taskResponse = taskService.createTask(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Task created successfully", taskResponse));
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
