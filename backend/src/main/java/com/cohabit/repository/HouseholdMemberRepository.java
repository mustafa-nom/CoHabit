package com.cohabit.repository;

import com.cohabit.model.Household;
import com.cohabit.model.HouseholdMember;
import com.cohabit.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HouseholdMemberRepository extends JpaRepository<HouseholdMember, Long> {
    
    Optional<HouseholdMember> findByUserAndHousehold(User user, Household household);
    
    Optional<HouseholdMember> findByUser(User user);
    
    // FIX: Changed "FROM members" to "FROM HouseholdMember" (Entity name)
    @Query("SELECT hm FROM HouseholdMember hm WHERE hm.user.id = :userId")
    Optional<HouseholdMember> findByUserId(@Param("userId") Long userId);
    
    List<HouseholdMember> findByHousehold(Household household);
    
    // FIX: Changed "FROM members" to "FROM HouseholdMember" (Entity name)
    @Query("SELECT hm FROM HouseholdMember hm JOIN FETCH hm.user WHERE hm.household.id = :householdId")
    List<HouseholdMember> findByHouseholdIdWithUser(@Param("householdId") Long householdId);
    
    boolean existsByUserAndHousehold(User user, Household household);
    
    boolean existsByUser(User user);
    
    void deleteByUserAndHousehold(User user, Household household);
}