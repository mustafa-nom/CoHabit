package com.cohabit.service;

import com.cohabit.dto.*;
import com.cohabit.exception.*;
import com.cohabit.model.*;
import com.cohabit.repository.*;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HouseholdService {

    private final HouseholdRepository householdRepository;
    private final HouseholdMemberRepository householdMemberRepository;
    private final JoinRequestRepository joinRequestRepository;
    private final UserRepository userRepository;

    private static final String ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int INVITE_CODE_LENGTH = 6;
    private final SecureRandom random = new SecureRandom();

    // Thread pool for parallel data fetching
    private ExecutorService executorService;

    @PostConstruct
    public void init() {
        executorService = Executors.newFixedThreadPool(4, r -> {
            Thread t = new Thread(r);
            t.setName("HouseholdService-Worker-" + t.getId());
            t.setDaemon(true);
            return t;
        });
        log.info("HouseholdService thread pool initialized with 4 threads");
    }

    @PreDestroy
    public void shutdown() {
        if (executorService != null) {
            executorService.shutdown();
            try {
                if (!executorService.awaitTermination(5, TimeUnit.SECONDS)) {
                    executorService.shutdownNow();
                }
            } catch (InterruptedException e) {
                executorService.shutdownNow();
                Thread.currentThread().interrupt();
            }
            log.info("HouseholdService thread pool shut down");
        }
    }

    private String generateInviteCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder(INVITE_CODE_LENGTH);
            for (int i = 0; i < INVITE_CODE_LENGTH; i++) {
                sb.append(ALPHANUMERIC.charAt(random.nextInt(ALPHANUMERIC.length())));
            }
            code = sb.toString();
        } while (householdRepository.existsByInviteCode(code));
        return code;
    }

    @Transactional
    public HouseholdResponse createHousehold(CreateHouseholdRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (householdMemberRepository.existsByUser(user)) {
            throw new AlreadyInHouseholdException("You are already in a household. Leave your current household first.");
        }

        Household household = new Household();
        household.setName(request.getName());
        household.setAddress(request.getAddress());
        household.setDescription(request.getDescription());
        household.setHost(user);
        household.setInviteCode(generateInviteCode());

        Household savedHousehold = householdRepository.save(household);

        HouseholdMember hostMember = new HouseholdMember();
        hostMember.setHousehold(savedHousehold);
        hostMember.setUser(user);
        // FIX: Changed HOST to OWNER to match the Entity and Database Enum
        hostMember.setRole(HouseholdMember.MemberRole.OWNER); 
        householdMemberRepository.save(hostMember);

        return buildHouseholdResponseSequential(savedHousehold, user);
    }

    @Transactional(readOnly = true)
    public HouseholdResponse getCurrentHousehold(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        HouseholdMember membership = householdMemberRepository.findByUser(user)
                .orElse(null);

        if (membership == null) {
            return null;
        }

        Household household = householdRepository.findByIdWithMembers(membership.getHousehold().getId())
                .orElseThrow(() -> new HouseholdNotFoundException("Household not found"));

        return buildHouseholdResponseParallel(household, user);
    }

    private HouseholdResponse buildHouseholdResponseParallel(Household household, User currentUser) {
        // long startTime = System.currentTimeMillis();
        boolean isHost = household.getHost().getId().equals(currentUser.getId());
        final Long householdId = household.getId();

        // Note: These run in separate threads without the main transaction. 
        // This works only because your Repositories use "JOIN FETCH" to load the User eagerly.
        CompletableFuture<List<HouseholdMember>> membersFuture = CompletableFuture.supplyAsync(() -> {
            try { Thread.sleep(50); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            return householdMemberRepository.findByHouseholdIdWithUser(householdId);
        }, executorService);

        // Create CompletableFuture for fetching pending requests
        CompletableFuture<List<JoinRequest>> requestsFuture = CompletableFuture.supplyAsync(() -> {
            List<JoinRequest> requests = joinRequestRepository.findPendingByHouseholdId(householdId, JoinRequest.RequestStatus.PENDING);
            return requests;
        }, executorService);

        try {
            CompletableFuture<Void> allFutures = CompletableFuture.allOf(membersFuture, requestsFuture);
            allFutures.get(5, TimeUnit.SECONDS);

            List<HouseholdMember> members = membersFuture.get();
            List<JoinRequest> pendingRequests = requestsFuture.get();

            List<HouseholdResponse.MemberInfo> memberInfos = members.stream()
                    .map(m -> HouseholdResponse.MemberInfo.builder()
                            .userId(m.getUser().getId())
                            .displayName(m.getUser().getDisplayName())
                            .username(m.getUser().getUsername())
                            .role(m.getRole().name())
                            .joinedAt(m.getJoinedAt())
                            .build())
                    .collect(Collectors.toList());

            List<HouseholdResponse.JoinRequestInfo> requestInfos = isHost ? pendingRequests.stream()
                    .map(jr -> HouseholdResponse.JoinRequestInfo.builder()
                            .requestId(jr.getId())
                            .userId(jr.getUser().getId())
                            .displayName(jr.getUser().getDisplayName())
                            .username(jr.getUser().getUsername())
                            .requestedAt(jr.getRequestedAt())
                            .build())
                    .collect(Collectors.toList()) : null;

            return HouseholdResponse.builder()
                    .id(household.getId())
                    .name(household.getName())
                    .inviteCode(household.getInviteCode())
                    .address(household.getAddress())
                    .description(household.getDescription())
                    .memberCount(members.size())
                    .hostId(household.getHost().getId())
                    .hostDisplayName(household.getHost().getDisplayName())
                    .currentUserRole(isHost ? "OWNER" : "MEMBER") // Updated string to match Enum concept
                    .members(memberInfos)
                    .pendingRequests(requestInfos)
                    .isHost(isHost)
                    .createdAt(household.getCreatedAt())
                    .build();

        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            log.error("Parallel fetch failed", e);
            throw new RuntimeException("Failed to fetch household data", e);
        }
    }

    private HouseholdResponse buildHouseholdResponseSequential(Household household, User currentUser) {
        List<HouseholdMember> members = householdMemberRepository.findByHouseholdIdWithUser(household.getId());
        List<JoinRequest> pendingRequests = joinRequestRepository.findPendingByHouseholdId(household.getId(), JoinRequest.RequestStatus.PENDING);

        boolean isHost = household.getHost().getId().equals(currentUser.getId());

        List<HouseholdResponse.MemberInfo> memberInfos = members.stream()
                .map(m -> HouseholdResponse.MemberInfo.builder()
                        .userId(m.getUser().getId())
                        .displayName(m.getUser().getDisplayName())
                        .username(m.getUser().getUsername())
                        .role(m.getRole().name())
                        .joinedAt(m.getJoinedAt())
                        .build())
                .collect(Collectors.toList());

        List<HouseholdResponse.JoinRequestInfo> requestInfos = isHost ? pendingRequests.stream()
                .map(jr -> HouseholdResponse.JoinRequestInfo.builder()
                        .requestId(jr.getId())
                        .userId(jr.getUser().getId())
                        .displayName(jr.getUser().getDisplayName())
                        .username(jr.getUser().getUsername())
                        .requestedAt(jr.getRequestedAt())
                        .build())
                .collect(Collectors.toList()) : null;

        return HouseholdResponse.builder()
                .id(household.getId())
                .name(household.getName())
                .inviteCode(household.getInviteCode())
                .address(household.getAddress())
                .description(household.getDescription())
                .memberCount(members.size())
                .hostId(household.getHost().getId())
                .hostDisplayName(household.getHost().getDisplayName())
                .currentUserRole(isHost ? "OWNER" : "MEMBER")
                .members(memberInfos)
                .pendingRequests(requestInfos)
                .isHost(isHost)
                .createdAt(household.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public HouseholdPreviewResponse findByInviteCode(String inviteCode) {
        Household household = householdRepository.findByInviteCode(inviteCode.toUpperCase())
                .orElseThrow(() -> new InvalidInviteCodeException("Invalid Group Code, try again!"));

        return HouseholdPreviewResponse.builder()
                .id(household.getId())
                .name(household.getName())
                .description(household.getDescription())
                .memberCount(household.getMemberCount())
                .hostDisplayName(household.getHost().getDisplayName())
                .build();
    }

    @Transactional
    public void requestToJoin(Long householdId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (householdMemberRepository.existsByUser(user)) {
            throw new AlreadyInHouseholdException("You are already in a household. Leave your current household first.");
        }

        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new HouseholdNotFoundException("Household not found"));

        if (joinRequestRepository.existsByUserAndHouseholdAndStatus(user, household, JoinRequest.RequestStatus.PENDING)) {
            throw new AlreadyInHouseholdException("You already have a pending request for this household.");
        }

        JoinRequest joinRequest = new JoinRequest();
        joinRequest.setHousehold(household);
        joinRequest.setUser(user);
        joinRequest.setStatus(JoinRequest.RequestStatus.PENDING);
        joinRequestRepository.save(joinRequest);
    }

    @Transactional(readOnly = true)
    public List<HouseholdResponse.JoinRequestInfo> getPendingRequests(Long householdId, Long userId) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new HouseholdNotFoundException("Household not found"));

        if (!household.getHost().getId().equals(userId)) {
            throw new UnauthorizedHouseholdActionException("Only the host can view pending requests");
        }

        List<JoinRequest> pendingRequests = joinRequestRepository.findPendingByHouseholdId(householdId, JoinRequest.RequestStatus.PENDING);

        return pendingRequests.stream()
                .map(jr -> HouseholdResponse.JoinRequestInfo.builder()
                        .requestId(jr.getId())
                        .userId(jr.getUser().getId())
                        .displayName(jr.getUser().getDisplayName())
                        .username(jr.getUser().getUsername())
                        .requestedAt(jr.getRequestedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void handleJoinRequest(Long requestId, boolean accept, Long userId) {
        JoinRequest joinRequest = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new HouseholdNotFoundException("Join request not found"));

        Household household = joinRequest.getHousehold();

        if (!household.getHost().getId().equals(userId)) {
            throw new UnauthorizedHouseholdActionException("Only the host can handle join requests");
        }

        if (joinRequest.getStatus() != JoinRequest.RequestStatus.PENDING) {
            throw new IllegalStateException("This request has already been processed");
        }

        if (accept) {
            if (householdMemberRepository.existsByUser(joinRequest.getUser())) {
                joinRequest.setStatus(JoinRequest.RequestStatus.REJECTED);
                joinRequest.setJoinedAt(LocalDateTime.now());
                joinRequestRepository.save(joinRequest);
                throw new AlreadyInHouseholdException("User has already joined another household");
            }

            HouseholdMember newMember = new HouseholdMember();
            newMember.setHousehold(household);
            newMember.setUser(joinRequest.getUser());
            newMember.setRole(HouseholdMember.MemberRole.MEMBER);
            householdMemberRepository.save(newMember);

            joinRequest.setStatus(JoinRequest.RequestStatus.ACCEPTED);
        } else {
            joinRequest.setStatus(JoinRequest.RequestStatus.REJECTED);
        }

        joinRequest.setJoinedAt(LocalDateTime.now());
        
        // Also track WHO responded
        User host = userRepository.getReferenceById(userId);
        joinRequest.setRespondedBy(host);
        
        joinRequestRepository.save(joinRequest);
    }

    @Transactional
    public void leaveHousehold(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        HouseholdMember membership = householdMemberRepository.findByUser(user)
                .orElseThrow(() -> new HouseholdNotFoundException("You are not in any household"));

        Household household = membership.getHousehold();

        // FIX: Changed HOST to OWNER
        if (membership.getRole() == HouseholdMember.MemberRole.OWNER) {
            List<HouseholdMember> members = householdMemberRepository.findByHousehold(household);

            if (members.size() == 1) {
                householdRepository.delete(household);
            } else {
                HouseholdMember newHost = members.stream()
                        .filter(m -> !m.getUser().getId().equals(userId))
                        .findFirst()
                        .orElseThrow(() -> new IllegalStateException("No other members to transfer host role"));

                // FIX: Changed HOST to OWNER
                newHost.setRole(HouseholdMember.MemberRole.OWNER);
                household.setHost(newHost.getUser());
                householdMemberRepository.save(newHost);
                householdRepository.save(household);
                householdMemberRepository.delete(membership);
            }
        } else {
            householdMemberRepository.delete(membership);
        }
    }
}