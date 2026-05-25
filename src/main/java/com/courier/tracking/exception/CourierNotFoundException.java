package com.courier.tracking.exception;

public class CourierNotFoundException extends RuntimeException {
    public CourierNotFoundException(String id) {
        super("Courier not found with id: " + id);
    }
}