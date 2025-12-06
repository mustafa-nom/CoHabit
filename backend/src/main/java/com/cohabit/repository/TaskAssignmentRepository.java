package com.cohabit.repository;

import com.cohabit.model.TaskAssignment;
import com.cohabit.model.Task;
import com.cohabit.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {

    // Find all assignments for a task
    List<TaskAssignment> findByTask(Task task);

    // Find assignments for a task with user details eagerly loaded
    @Query("SELECT ta FROM TaskAssignment ta " +
           "JOIN FETCH ta.assignee " +
           "WHERE ta.task.id = :taskId " +
           "AND ta.status = :status")
    List<TaskAssignment> findByTaskIdAndStatusWithUser(
            @Param("taskId") Long taskId,
            @Param("status") TaskAssignment.AssignmentStatus status);

    // Find all assignments for a specific user
    List<TaskAssignment> findByAssigneeIdAndStatus(
            Long assigneeId,
            TaskAssignment.AssignmentStatus status);

    // Check if a task-user assignment already exists
    boolean existsByTaskAndAssignee(Task task, User assignee);

    // Find a specific assignment by task and assignee
    Optional<TaskAssignment> findByTaskAndAssignee(Task task, User assignee);

    // Delete all assignments for a task
    void deleteByTask(Task task);
}
