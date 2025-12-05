package com.cohabit.repository;

import com.cohabit.model.Household;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HouseholdRepository extends JpaRepository<Household, Long> {
    
    Optional<Household> findByInviteCode(String inviteCode);
    
    boolean existsByInviteCode(String inviteCode);
    
    @Query("SELECT h FROM Household h LEFT JOIN FETCH h.members WHERE h.id = :id")
    Optional<Household> findByIdWithMembers(@Param("id") Long id);
    
    @Query("SELECT h FROM Household h LEFT JOIN FETCH h.joinRequests jr LEFT JOIN FETCH jr.user WHERE h.id = :id")
    Optional<Household> findByIdWithJoinRequests(@Param("id") Long id);
}