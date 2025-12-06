package com.cohabit.exception;

public class InvalidTaskAssignmentException extends RuntimeException {
    public InvalidTaskAssignmentException(String message) {
        super(message);
    }
}
