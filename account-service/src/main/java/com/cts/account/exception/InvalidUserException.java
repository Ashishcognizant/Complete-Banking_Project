package com.cts.account.exception;

public class InvalidUserException extends RuntimeException {
    public InvalidUserException(String message) {
        super(message);
    }
}
