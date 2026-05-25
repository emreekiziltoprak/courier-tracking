package com.courier.tracking.exception;

public class LocationProcessingException extends RuntimeException {
    public LocationProcessingException(String message, Throwable cause) {
        super(message, cause);
    }
}