package com.cohabit.repository;

import com.cohabit.model.Household;
import com.cohabit.model.JoinRequest;
import com.cohabit.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JoinRequestRepository extends JpaRepository<JoinRequest, Long> {
    
    Optional<JoinRequest> findByUserAndHousehold(User user, Household household);
    
    @Query("SELECT jr FROM JoinRequest jr WHERE jr.user.id = :userId AND jr.household.id = :householdId")
    Optional<JoinRequest> findByUserIdAndHouseholdId(@Param("userId") Long userId, @Param("householdId") Long householdId);
    
    // FIX: Pass status as a parameter instead of hardcoding '0'
    @Query("SELECT jr FROM JoinRequest jr JOIN FETCH jr.user WHERE jr.household.id = :householdId AND jr.status = :status")
    List<JoinRequest> findPendingByHouseholdId(@Param("householdId") Long householdId, @Param("status") JoinRequest.RequestStatus status);
    
    List<JoinRequest> findByHouseholdAndStatus(Household household, JoinRequest.RequestStatus status);
    
    boolean existsByUserAndHouseholdAndStatus(User user, Household household, JoinRequest.RequestStatus status);
    
    // FIX: Pass status as a parameter here too
    @Query("SELECT COUNT(jr) FROM JoinRequest jr WHERE jr.household.id = :householdId AND jr.status = :status")
    int countPendingByHouseholdId(@Param("householdId") Long householdId, @Param("status") JoinRequest.RequestStatus status);
}