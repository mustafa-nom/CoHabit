package com.cohabit.repository;

import com.cohabit.model.TaskCompletion;
import com.cohabit.model.Task;
import com.cohabit.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskCompletionRepository extends JpaRepository<TaskCompletion, Long> {
    
    List<TaskCompletion> findByTask(Task task);
    
    List<TaskCompletion> findByCompletedBy(User user);
    
    Optional<TaskCompletion> findByTaskAndCompletedBy(Task task, User user);
    
    List<TaskCompletion> findByTaskHouseholdId(Long householdId);
}

