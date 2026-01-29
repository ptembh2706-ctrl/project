package com.etour.app.razorpay.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.etour.app.razorpay.dto.RazorpayVerifyRequestDTO;
import com.etour.app.razorpay.service.RazorpayVerifyService;

@RestController
@RequestMapping("/api/razorpay")
public class RazorpayVerifyController {

    private final RazorpayVerifyService verifyService;

    public RazorpayVerifyController(RazorpayVerifyService verifyService) {
        this.verifyService = verifyService;
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<String> verifyPayment(
            @RequestBody RazorpayVerifyRequestDTO request
    ) {

        verifyService.verifyPayment(
                request.getBookingId(),
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        return ResponseEntity.ok("Payment verified successfully");
    }
}

