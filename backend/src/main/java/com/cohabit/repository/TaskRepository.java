package com.cohabit.repository;

import com.cohabit.model.Task;
import com.cohabit.model.Household;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Find all tasks for a household
    List<Task> findByHousehold(Household household);

    // Find tasks by household ID with status filtering
    List<Task> findByHouseholdIdAndStatus(Long householdId, Task.TaskStatus status);

    // Find task by ID with eager loading of household and creator
    @Query("SELECT t FROM Task t " +
           "JOIN FETCH t.household " +
           "JOIN FETCH t.createdBy " +
           "WHERE t.id = :taskId")
    Optional<Task> findByIdWithDetails(@Param("taskId") Long taskId);

    // Find all tasks created by a specific user
    List<Task> findByCreatedById(Long userId);

    // Count tasks for a household
    long countByHouseholdId(Long householdId);
}
