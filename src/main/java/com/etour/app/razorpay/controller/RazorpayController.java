package com.etour.app.razorpay.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.etour.app.razorpay.dto.RazorpayOrderRequestDTO;
import com.etour.app.razorpay.dto.RazorpayOrderResponseDTO;
import com.etour.app.razorpay.service.RazorpayService;

@RestController
@RequestMapping("/api/razorpay")
public class RazorpayController {

    private final RazorpayService razorpayService;

    public RazorpayController(RazorpayService razorpayService) {
        this.razorpayService = razorpayService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<RazorpayOrderResponseDTO> createOrder(
            @RequestBody RazorpayOrderRequestDTO request
    ) {
        return ResponseEntity.ok(
                razorpayService.createOrder(request)
        );
    }
}
