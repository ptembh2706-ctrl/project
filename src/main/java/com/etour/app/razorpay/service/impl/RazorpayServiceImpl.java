package com.etour.app.razorpay.service.impl;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.etour.app.entity.BookingHeader;
import com.etour.app.repository.BookingHeaderRepository;
import com.etour.app.razorpay.dto.RazorpayOrderRequestDTO;
import com.etour.app.razorpay.dto.RazorpayOrderResponseDTO;
import com.etour.app.razorpay.service.RazorpayService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

@Service
public class RazorpayServiceImpl implements RazorpayService {

    private final RazorpayClient razorpayClient;
    private final BookingHeaderRepository bookingRepository;

    public RazorpayServiceImpl(
            RazorpayClient razorpayClient,
            BookingHeaderRepository bookingRepository
    ) {
        this.razorpayClient = razorpayClient;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public RazorpayOrderResponseDTO createOrder(RazorpayOrderRequestDTO request) {

        // 1️⃣ Validate booking exists
        BookingHeader booking = bookingRepository.findById(
                request.getBookingId().intValue()
        ).orElseThrow(() ->
                new RuntimeException("Booking not found with ID: " + request.getBookingId())
        );

        // ✨ Validate booking status
        if (!"PENDING".equalsIgnoreCase(booking.getBookingStatus())) {
            throw new RuntimeException("Only PENDING bookings can be paid");
        }

        // ✨ Validate customer exists (CRITICAL FIX)
        if (booking.getCustomer() == null) {
            throw new RuntimeException("Booking customer not found");
        }

        // ✨ Validate total amount is not null (CRITICAL FIX)
        if (booking.getTotalAmount() == null) {
            throw new RuntimeException("Booking amount is not set");
        }

        try {
            // 2️⃣ Amount strictly from DB (INR → paise) with validation
            long amountInPaise = booking.getTotalAmount()
                    .multiply(java.math.BigDecimal.valueOf(100))
                    .longValue();

            // ✨ Validate minimum amount - 100 paise = ₹1 (CRITICAL FIX)
            if (amountInPaise < 100) {
                throw new RuntimeException("Booking amount must be at least ₹1.00. Current amount: " + booking.getTotalAmount());
            }

            // ✨ Validate amount is positive (CRITICAL FIX)
            if (amountInPaise <= 0) {
                throw new RuntimeException("Booking amount must be positive");
            }

            JSONObject options = new JSONObject();
            options.put("amount", amountInPaise);
            options.put("currency", "INR");
            options.put("receipt", "booking_" + booking.getId());

            System.out.println("DEBUG: Creating Razorpay order with payload: " + options.toString());

            // 3️⃣ Create Razorpay order
            Order order = razorpayClient.orders.create(options);

            // 4️⃣ Prepare response safely
            RazorpayOrderResponseDTO response = new RazorpayOrderResponseDTO();
            response.setOrderId(order.get("id"));
            response.setCurrency(order.get("currency"));

            // ✅ SAFE numeric conversion (IMPORTANT)
            Number amount = (Number) order.get("amount");
            response.setAmount(amount.longValue());

            response.setBookingId(booking.getId().longValue());

            System.out.println("DEBUG: Razorpay order created successfully. Order ID: " + response.getOrderId() + ", Amount: " + response.getAmount());

            return response;

        } catch (Exception e) {
            // ✨ Better error handling - parse Razorpay errors (FIXES DEBUGGING)
            String errorMsg = e.getMessage();
            if (e.getCause() != null && e.getCause().getMessage() != null) {
                errorMsg = "Razorpay API Error: " + e.getCause().getMessage();
            }
            System.out.println("ERROR: Failed to create Razorpay order: " + errorMsg);
            e.printStackTrace();
            throw new RuntimeException("Failed to create Razorpay order: " + errorMsg, e);
        }
    }
}

