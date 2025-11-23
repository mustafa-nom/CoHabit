package com.cohabit.service;

import com.cohabit.dto.AuthResponse;
import com.cohabit.dto.LoginRequest;
import com.cohabit.dto.RegisterRequest;
import com.cohabit.exception.InvalidCredentialsException;
import com.cohabit.exception.UserNotFoundException;
import com.cohabit.model.AuthLog;
import com.cohabit.model.User;
import com.cohabit.repository.AuthLogRepository;
import com.cohabit.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthLogRepository authLogRepository;

    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletRequest httpRequest) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPasswordHash(request.getPassword()); // Will be hashed in UserService
        user.setDisplayName(request.getDisplayName());
        user.setFname(request.getFname());
        user.setLname(request.getLname());
        user.setEmailVerified(false);
        user.setTotalXp(0);
        user.setLevel(1);

        User savedUser = userService.createUser(user);

        // Log registration
        logAuthAttempt(savedUser, AuthLog.AttemptType.REGISTER, httpRequest);

        // Send welcome email (mock)
        emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getDisplayName());

        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getEmail());

        return new AuthResponse(token, savedUser.getId(), savedUser.getEmail(),
                savedUser.getUsername(), savedUser.getDisplayName());
    }

    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        Optional<User> userOpt = userService.findByEmailOrUsername(request.getEmailOrUsername());

        if (userOpt.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        User user = userOpt.get();

        if (!userService.validatePassword(user, request.getPassword())) {
            // Log failed login
            logAuthAttempt(user, AuthLog.AttemptType.FAILED_LOGIN, httpRequest);
            throw new InvalidCredentialsException("Invalid password");
        }

        // Log successful login
        logAuthAttempt(user, AuthLog.AttemptType.LOGIN, httpRequest);

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(token, user.getId(), user.getEmail(),
                user.getUsername(), user.getDisplayName());
    }

    @Transactional
    public void logout(Long userId, HttpServletRequest httpRequest) {
        User user = userService.getUserById(userId);
        logAuthAttempt(user, AuthLog.AttemptType.LOGOUT, httpRequest);
    }

    private void logAuthAttempt(User user, AuthLog.AttemptType attemptType, HttpServletRequest request) {
        AuthLog log = new AuthLog();
        log.setUser(user);
        log.setAttemptType(attemptType);
        log.setIpAddress(getClientIp(request));
        log.setUserAgent(request.getHeader("User-Agent"));
        authLogRepository.save(log);
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
