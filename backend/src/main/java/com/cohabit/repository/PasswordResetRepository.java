package com.cohabit.repository;

import com.cohabit.model.PasswordReset;
import com.cohabit.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetRepository extends JpaRepository<PasswordReset, Long> {
    Optional<PasswordReset> findByToken(String token);
    Optional<PasswordReset> findByUserAndIsUsedFalse(User user);
    void deleteByUser(User user);
}
