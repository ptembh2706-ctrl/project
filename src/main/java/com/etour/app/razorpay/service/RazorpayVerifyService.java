package com.etour.app.razorpay.service;

public interface RazorpayVerifyService {

	void verifyPayment(
            Long bookingId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature
    );
}
