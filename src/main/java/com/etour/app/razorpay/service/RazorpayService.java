package com.etour.app.razorpay.service;

import com.etour.app.razorpay.dto.RazorpayOrderRequestDTO;
import com.etour.app.razorpay.dto.RazorpayOrderResponseDTO;

public interface RazorpayService {

    RazorpayOrderResponseDTO createOrder(RazorpayOrderRequestDTO request);
}
