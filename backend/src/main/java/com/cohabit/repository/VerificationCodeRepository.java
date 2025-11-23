package com.cohabit.repository;

import com.cohabit.model.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    Optional<VerificationCode> findByCodeAndContactInfo(String code, String contactInfo);
    Optional<VerificationCode> findByContactInfoAndIsUsedFalseAndExpiresAtAfter(String contactInfo, LocalDateTime now);
    void deleteByContactInfo(String contactInfo);
}
