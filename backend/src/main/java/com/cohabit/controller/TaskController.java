package com.cohabit.controller;

import com.cohabit.dto.ApiResponse;
import com.cohabit.dto.CreateTaskRequest;
import com.cohabit.dto.UpdateTaskRequest;
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
     * Get all tasks for current user's household
     * GET /tasks
     */
    @GetMapping
    public ResponseEntity<ApiResponse<java.util.List<TaskResponse>>> getAllTasks(
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        java.util.List<TaskResponse> tasks = taskService.getAllTasksForUserHousehold(userId);
        return ResponseEntity.ok(ApiResponse.success("Tasks retrieved successfully", tasks));
    }

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
     * Toggle task completion status
     * POST /tasks/{id}/toggle
     */
    @PostMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<TaskResponse>> toggleTaskCompletion(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        TaskResponse taskResponse = taskService.toggleTaskCompletion(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Task status updated successfully", taskResponse));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskRequest request,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        TaskResponse taskResponse = taskService.updateTask(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", taskResponse));
    }

    /**
     * Delete a task
     * DELETE /tasks/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        taskService.deleteTask(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully"));
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
