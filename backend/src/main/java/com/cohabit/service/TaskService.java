package com.cohabit.service;

import com.cohabit.dto.CreateTaskRequest;
import com.cohabit.dto.TaskResponse;
import com.cohabit.exception.*;
import com.cohabit.model.*;
import com.cohabit.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskAssignmentRepository taskAssignmentRepository;
    private final UserRepository userRepository;
    private final HouseholdMemberRepository householdMemberRepository;
    private final HouseholdRepository householdRepository;

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasksForUserHousehold(Long userId) {
        // Step 1: Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Step 2: Get user's household
        HouseholdMember membership = householdMemberRepository.findByUser(user)
                .orElseThrow(() -> new NotInHouseholdException(
                        "You must be in a household to view tasks"));

        Household household = membership.getHousehold();

        // Step 3: Get all tasks for the household
        List<Task> tasks = taskRepository.findByHousehold(household);

        // Step 4: Build response for each task
        return tasks.stream()
                .map(this::buildTaskResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponse createTask(CreateTaskRequest request, Long userId) {
        // Step 1: Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Step 2: Validate user is in a household
        HouseholdMember membership = householdMemberRepository.findByUser(user)
                .orElseThrow(() -> new NotInHouseholdException(
                        "You must be in a household to create tasks"));

        // Step 3: Get user's household
        Household household = membership.getHousehold();

        // Step 4: Validate recurrence rule
        Task.RecurrenceRule recurrenceRule;
        try {
            recurrenceRule = Task.RecurrenceRule.valueOf(
                    request.getRecurrenceRule().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Invalid recurrence rule: " + request.getRecurrenceRule() +
                    ". Must be one of: NONE, DAILY, WEEKLY, MONTHLY, CUSTOM");
        }

        // Step 5: Handle assignee user IDs (default to creator if empty)
        List<Long> assigneeIds = request.getAssigneeUserIds();
        if (assigneeIds == null || assigneeIds.isEmpty()) {
            assigneeIds = List.of(userId); // Default to creator
        }

        // Step 6: Validate all assignees are in the same household
        for (Long assigneeId : assigneeIds) {
            User assigneeUser = userRepository.findById(assigneeId)
                    .orElseThrow(() -> new UserNotFoundException(
                            "Assignee user not found: " + assigneeId));

            HouseholdMember assigneeMembership = householdMemberRepository.findByUser(assigneeUser)
                    .orElseThrow(() -> new InvalidTaskAssignmentException(
                            "User " + assigneeId + " is not in any household"));

            if (!assigneeMembership.getHousehold().getId().equals(household.getId())) {
                throw new InvalidTaskAssignmentException(
                        "All assignees must be members of your household");
            }
        }

        // Step 7: Validate rotate assignments business rule
        if (request.getRotateAssignments() != null && request.getRotateAssignments()) {
            if (recurrenceRule == Task.RecurrenceRule.NONE) {
                throw new InvalidTaskAssignmentException(
                        "Cannot rotate assignments for non-recurring tasks");
            }
            if (assigneeIds.size() < 2) {
                throw new InvalidTaskAssignmentException(
                        "Rotate assignments requires at least 2 assignees");
            }
        }

        // Step 8: Create task entity
        Task task = new Task();
        task.setHousehold(household);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setRecurrenceRule(recurrenceRule);
        task.setRotateAssignments(request.getRotateAssignments() != null ?
                request.getRotateAssignments() : false);
        task.setEstimatedTime(request.getEstimatedTime());
        task.setCreatedBy(user);
        task.setStatus(Task.TaskStatus.OPEN);
        task.setDifficulty("MEDIUM"); // Default for now
        task.setXpPoints(20); // Default for now
        task.setIsFreeForAll(false); // Not implementing this feature

        Task savedTask = taskRepository.save(task);
        log.info("Created task {} for household {}", savedTask.getId(), household.getId());

        // Step 9: Create task assignment entities
        for (Long assigneeId : assigneeIds) {
            User assigneeUser = userRepository.getReferenceById(assigneeId);

            TaskAssignment assignment = new TaskAssignment();
            assignment.setTask(savedTask);
            assignment.setAssignee(assigneeUser);
            assignment.setStatus(TaskAssignment.AssignmentStatus.ACTIVE);

            taskAssignmentRepository.save(assignment);
            log.info("Assigned task {} to user {}", savedTask.getId(), assigneeId);
        }

        // Step 10: Build and return task response
        return buildTaskResponse(savedTask);
    }

    @Transactional
    public TaskResponse toggleTaskCompletion(Long taskId, Long userId) {
        // Step 1: Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Step 2: Validate task exists
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id: " + taskId));

        // Step 3: Validate user is in the task's household
        HouseholdMember membership = householdMemberRepository.findByUser(user)
                .orElseThrow(() -> new NotInHouseholdException(
                        "You must be in a household to toggle tasks"));

        if (!task.getHousehold().getId().equals(membership.getHousehold().getId())) {
            throw new NotInHouseholdException(
                    "You can only toggle tasks in your household");
        }

        // Step 4: Toggle the status
        // Only toggle between OPEN and COMPLETED
        // Keep completed tasks visible if deadline hasn't passed
        if (task.getStatus() == Task.TaskStatus.COMPLETED ||
            task.getStatus() == Task.TaskStatus.VERIFIED) {
            task.setStatus(Task.TaskStatus.OPEN);
            log.info("Task {} marked as OPEN by user {}", taskId, userId);
        } else {
            task.setStatus(Task.TaskStatus.COMPLETED);
            log.info("Task {} marked as COMPLETED by user {}", taskId, userId);
        }

        Task savedTask = taskRepository.save(task);

        // Step 5: Return updated task response
        return buildTaskResponse(savedTask);
    }

    private TaskResponse buildTaskResponse(Task task) {
        // Eagerly load assignments with assignee details
        List<TaskAssignment> assignments = taskAssignmentRepository
                .findByTaskIdAndStatusWithUser(task.getId(), TaskAssignment.AssignmentStatus.ACTIVE);

        List<TaskResponse.AssigneeInfo> assigneeInfos = assignments.stream()
                .map(a -> TaskResponse.AssigneeInfo.builder()
                        .userId(a.getAssignee().getId())
                        .displayName(a.getAssignee().getDisplayName())
                        .username(a.getAssignee().getUsername())
                        .assignmentStatus(a.getStatus().name())
                        .assignedAt(a.getAssignedAt())
                        .build())
                .collect(Collectors.toList());

        return TaskResponse.builder()
                .id(task.getId())
                .householdId(task.getHousehold().getId())
                .householdName(task.getHousehold().getName())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus().name())
                .dueDate(task.getDueDate())
                .recurrenceRule(task.getRecurrenceRule().name())
                .rotateAssignments(task.getRotateAssignments())
                .estimatedTime(task.getEstimatedTime())
                .createdByUserId(task.getCreatedBy().getId())
                .createdByDisplayName(task.getCreatedBy().getDisplayName())
                .assignees(assigneeInfos)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
