package com.cohabit.service;

import com.cohabit.exception.EmailAlreadyExistsException;
import com.cohabit.exception.UserNotFoundException;
import com.cohabit.exception.UsernameAlreadyExistsException;
import com.cohabit.model.User;
import com.cohabit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmailOrUsername(String emailOrUsername) {
        Optional<User> userByEmail = userRepository.findByEmail(emailOrUsername);
        if (userByEmail.isPresent()) {
            return userByEmail;
        }
        return userRepository.findByUsername(emailOrUsername);
    }

    @Transactional
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyExistsException("Email already in use: " + user.getEmail());
        }
        if (user.getUsername() != null && userRepository.existsByUsername(user.getUsername())) {
            throw new UsernameAlreadyExistsException("Username already taken: " + user.getUsername());
        }
        // Hash the password before saving
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, User updatedUser) {
        User user = getUserById(id);

        if (updatedUser.getDisplayName() != null) {
            user.setDisplayName(updatedUser.getDisplayName());
        }
        if (updatedUser.getFname() != null) {
            user.setFname(updatedUser.getFname());
        }
        if (updatedUser.getLname() != null) {
            user.setLname(updatedUser.getLname());
        }
        if (updatedUser.getTotalXp() != null) {
            user.setTotalXp(updatedUser.getTotalXp());
        }
        if (updatedUser.getLevel() != null) {
            user.setLevel(updatedUser.getLevel());
        }

        return userRepository.save(user);
    }

    @Transactional
    public User changePassword(Long userId, String currentPassword, String newPassword) {
        User user = getUserById(userId);

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    @Transactional
    public User changeEmail(Long userId, String newEmail) {
        User user = getUserById(userId);

        if (userRepository.existsByEmail(newEmail)) {
            throw new EmailAlreadyExistsException("Email already in use: " + newEmail);
        }

        user.setEmail(newEmail);
        user.setEmailVerified(false); // Need to verify new email
        return userRepository.save(user);
    }

    @Transactional
    public User changeUsername(Long userId, String newUsername) {
        User user = getUserById(userId);

        if (userRepository.existsByUsername(newUsername)) {
            throw new UsernameAlreadyExistsException("Username already taken: " + newUsername);
        }

        user.setUsername(newUsername);
        return userRepository.save(user);
    }

    @Transactional
    public User changeDisplayName(Long userId, String newDisplayName) {
        User user = getUserById(userId);
        user.setDisplayName(newDisplayName);
        return userRepository.save(user);
    }

    @Transactional
    public User verifyEmail(Long userId) {
        User user = getUserById(userId);
        user.setEmailVerified(true);
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    public boolean validatePassword(User user, String password) {
        return passwordEncoder.matches(password, user.getPasswordHash());
    }
}
