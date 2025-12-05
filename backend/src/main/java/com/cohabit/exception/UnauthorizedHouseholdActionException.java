package com.cohabit.exception;

public class UnauthorizedHouseholdActionException extends RuntimeException {
    public UnauthorizedHouseholdActionException(String message) {
        super(message);
    }
}