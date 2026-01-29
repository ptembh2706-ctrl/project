package com.etour.app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Business rule violation
    @ExceptionHandler(InvoiceNotAllowedException.class)
    public ResponseEntity<String> handleInvoiceNotAllowed(
            InvoiceNotAllowedException ex) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)   // 409
                .body(ex.getMessage());
    }

    // Any unexpected exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneric(Exception ex) {

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR) // 500
                .body("Something went wrong. Please try again later.");
    }
}
