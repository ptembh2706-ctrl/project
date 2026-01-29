package com.etour.app.razorpay.service.impl;

import java.nio.charset.StandardCharsets;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.etour.app.dto.PaymentDTO;
import com.etour.app.entity.BookingHeader;
import com.etour.app.repository.BookingHeaderRepository;
import com.etour.app.razorpay.service.RazorpayVerifyService;
import com.etour.app.service.PaymentService;

@Service
public class RazorpayVerifyServiceImpl implements RazorpayVerifyService {

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

    private final PaymentService paymentService;
    private final BookingHeaderRepository bookingRepository;

    public RazorpayVerifyServiceImpl(
            PaymentService paymentService,
            BookingHeaderRepository bookingRepository
    ) {
        this.paymentService = paymentService;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public void verifyPayment(
            Long bookingId,
            String orderId,
            String paymentId,
            String signature
    ) {

        try {
            // 1️⃣ Fetch booking
            BookingHeader booking = bookingRepository.findById(bookingId.intValue())
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            // 2️⃣ Generate expected signature
            String payload = orderId + "|" + paymentId;
            String expectedSignature = hmacSha256(payload, razorpaySecret);

            // 3️⃣ Verify signature
            if (!expectedSignature.equals(signature)) {
                throw new RuntimeException("Invalid Razorpay signature");
            }

            // 4️⃣ Create SUCCESS payment
            PaymentDTO dto = new PaymentDTO();
            dto.setBookingId(bookingId.intValue());
            dto.setTransactionId(paymentId);
            dto.setPaymentMode("RAZORPAY");
            dto.setPaymentStatus("SUCCESS");
            dto.setPaidAmount(booking.getTotalAmount());
            dto.setRazorpayOrderId(orderId);
            dto.setRazorpayPaymentId(paymentId);
            dto.setRazorpaySignature(signature);

            paymentService.addPayment(dto);

        } catch (Exception e) {
            throw new RuntimeException("Payment verification failed", e);
        }
    }

    // 🔐 HMAC SHA256
    private String hmacSha256(String data, String secret) throws Exception {

        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey =
                new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");

        mac.init(secretKey);

        byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

        StringBuilder hex = new StringBuilder(2 * rawHmac.length);
        for (byte b : rawHmac) {
            hex.append(String.format("%02x", b));
        }
        return hex.toString();
    }
}
