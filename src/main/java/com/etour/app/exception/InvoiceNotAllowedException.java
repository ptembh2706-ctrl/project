package com.etour.app.exception;

public class InvoiceNotAllowedException extends RuntimeException {

    public InvoiceNotAllowedException(String message) {
        super(message);
    }
}
