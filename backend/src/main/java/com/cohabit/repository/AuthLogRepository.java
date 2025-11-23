package com.cohabit.repository;

import com.cohabit.model.AuthLog;
import com.cohabit.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuthLogRepository extends JpaRepository<AuthLog, Long> {
    List<AuthLog> findByUserOrderByTimestampDesc(User user);
    List<AuthLog> findByUserAndTimestampAfter(User user, LocalDateTime after);
    long countByUserAndAttemptTypeAndTimestampAfter(User user, AuthLog.AttemptType attemptType, LocalDateTime after);
}
