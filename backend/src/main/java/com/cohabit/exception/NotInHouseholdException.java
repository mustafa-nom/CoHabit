package com.cohabit.exception;

public class NotInHouseholdException extends RuntimeException {
    public NotInHouseholdException(String message) {
        super(message);
    }
}
