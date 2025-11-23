package com.cohabit.service;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    /**
     * Mock email sending for testing purposes.
     * In production, this would integrate with a real email service (e.g., AWS SES, SendGrid).
     * For now, it just logs the email content.
     */
    public void sendVerificationEmail(String toEmail, String verificationCode) {
        logger.info("==============================================");
        logger.info("MOCK EMAIL - Verification Code");
        logger.info("To: {}", toEmail);
        logger.info("Subject: Email Verification Code");
        logger.info("Code: {}", verificationCode);
        logger.info("This code will expire in 15 minutes.");
        logger.info("==============================================");
    }

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        logger.info("==============================================");
        logger.info("MOCK EMAIL - Password Reset");
        logger.info("To: {}", toEmail);
        logger.info("Subject: Password Reset Request");
        logger.info("Reset Token: {}", resetToken);
        logger.info("This token will expire in 1 hour.");
        logger.info("==============================================");
    }

    public void sendWelcomeEmail(String toEmail, String displayName) {
        logger.info("==============================================");
        logger.info("MOCK EMAIL - Welcome");
        logger.info("To: {}", toEmail);
        logger.info("Subject: Welcome to CoHabit!");
        logger.info("Hello {}, welcome to CoHabit!", displayName);
        logger.info("==============================================");
    }
}
