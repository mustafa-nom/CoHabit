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
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthLogRepository authLogRepository;

    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletRequest httpRequest) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(request.getPassword());
        user.setDisplayName(request.getDisplayName());
        user.setTotalXp(0);
        user.setLevel(1);

        User savedUser = userService.createUser(user);

        logAuthAttempt(savedUser, AuthLog.AttemptType.REGISTER);

        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getUsername());

        return new AuthResponse(token, savedUser.getId(), savedUser.getUsername(), savedUser.getDisplayName());
    }

    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        Optional<User> userOpt = userService.findByUsername(request.getUsername());

        if (userOpt.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        User user = userOpt.get();

        if (!userService.validatePassword(user, request.getPassword())) {
            logAuthAttempt(user, AuthLog.AttemptType.FAILED_LOGIN);
            throw new InvalidCredentialsException("Invalid password");
        }

        logAuthAttempt(user, AuthLog.AttemptType.LOGIN);

        String token = jwtUtil.generateToken(user.getId(), user.getUsername());

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getDisplayName());
    }

    @Transactional
    public void logout(Long userId, HttpServletRequest httpRequest) {
        User user = userService.getUserById(userId);
        logAuthAttempt(user, AuthLog.AttemptType.LOGOUT);
    }

    private void logAuthAttempt(User user, AuthLog.AttemptType attemptType) {
        AuthLog log = new AuthLog();
        log.setUser(user);
        log.setAttemptType(attemptType);
        authLogRepository.save(log);
    }
}