package com.cohabit.service;

import com.cohabit.exception.InvalidVerificationCodeException;
import com.cohabit.model.VerificationCode;
import com.cohabit.repository.VerificationCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class VerificationService {

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 6;
    private static final SecureRandom random = new SecureRandom();

    public String generateCode() {
        StringBuilder code = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            code.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return code.toString();
    }

    @Transactional
    public VerificationCode createVerificationCode(String contactInfo) {
        // Delete any existing codes for this contact
        verificationCodeRepository.deleteByContactInfo(contactInfo);

        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setCode(generateCode());
        verificationCode.setContactInfo(contactInfo);
        verificationCode.setIsUsed(false);

        return verificationCodeRepository.save(verificationCode);
    }

    @Transactional
    public boolean validateAndUseCode(String code, String contactInfo) {
        Optional<VerificationCode> verificationCodeOpt =
                verificationCodeRepository.findByCodeAndContactInfo(code, contactInfo);

        if (verificationCodeOpt.isEmpty()) {
            throw new InvalidVerificationCodeException("Invalid verification code");
        }

        VerificationCode verificationCode = verificationCodeOpt.get();

        if (verificationCode.getIsUsed()) {
            throw new InvalidVerificationCodeException("Verification code already used");
        }

        if (verificationCode.isExpired()) {
            throw new InvalidVerificationCodeException("Verification code has expired");
        }

        // Mark code as used
        verificationCode.setIsUsed(true);
        verificationCodeRepository.save(verificationCode);

        return true;
    }

    public boolean hasValidCode(String contactInfo) {
        Optional<VerificationCode> codeOpt =
                verificationCodeRepository.findByContactInfoAndIsUsedFalseAndExpiresAtAfter(
                        contactInfo, LocalDateTime.now());
        return codeOpt.isPresent();
    }
}
