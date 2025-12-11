package com.cohabit.service;

import com.cohabit.dto.LeaderboardResponse;
import com.cohabit.exception.NotInHouseholdException;
import com.cohabit.exception.UserNotFoundException;
import com.cohabit.model.Household;
import com.cohabit.model.HouseholdMember;
import com.cohabit.model.User;
import com.cohabit.repository.HouseholdMemberRepository;
import com.cohabit.repository.TaskCompletionRepository;
import com.cohabit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeaderboardService {

    private final UserRepository userRepository;
    private final HouseholdMemberRepository householdMemberRepository;
    private final TaskCompletionRepository taskCompletionRepository;

    @Transactional(readOnly = true)
    public List<LeaderboardResponse> getHouseholdLeaderboard(Long userId) {
        // Step 1: Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Step 2: Get user's household
        HouseholdMember membership = householdMemberRepository.findByUser(user)
                .orElseThrow(() -> new NotInHouseholdException(
                        "You must be in a household to view leaderboard"));

        Household household = membership.getHousehold();

        // Step 3: Get all members of the household
        List<HouseholdMember> members = householdMemberRepository
                .findByHouseholdIdWithUser(household.getId());

        // Step 4: Build leaderboard entries
        List<LeaderboardResponse> leaderboard = new ArrayList<>();
        
        for (HouseholdMember member : members) {
            User memberUser = member.getUser();
            
            // Count completed tasks
            int tasksCompleted = taskCompletionRepository
                    .findByCompletedBy(memberUser).size();
            
            LeaderboardResponse entry = LeaderboardResponse.builder()
                    .userId(memberUser.getId())
                    .displayName(memberUser.getDisplayName())
                    .username(memberUser.getUsername())
                    .totalXp(memberUser.getTotalXp() != null ? memberUser.getTotalXp() : 0)
                    .level(memberUser.getLevel() != null ? memberUser.getLevel() : 1)
                    .tasksCompleted(tasksCompleted)
                    .build();
            
            leaderboard.add(entry);
        }

        // Step 5: Sort by total XP (descending) and assign ranks
        leaderboard.sort(Comparator.comparing(LeaderboardResponse::getTotalXp).reversed());
        
        int rank = 1;
        for (LeaderboardResponse entry : leaderboard) {
            entry.setRank(rank++);
        }

        log.info("Retrieved leaderboard for household {} with {} members", 
                household.getId(), leaderboard.size());
        
        return leaderboard;
    }
}

