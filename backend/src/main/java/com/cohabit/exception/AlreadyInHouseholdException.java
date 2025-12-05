package com.cohabit.exception;

public class AlreadyInHouseholdException extends RuntimeException {
    public AlreadyInHouseholdException(String message) {
        super(message);
    }
}