package com.etour.app.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.etour.app.dto.PaymentDTO;
import com.etour.app.email.service.EmailService;
import com.etour.app.email.util.EmailTemplateUtil;
import com.etour.app.entity.BookingHeader;
import com.etour.app.entity.Payment;
import com.etour.app.invoice.dto.InvoiceResponseDTO;
import com.etour.app.invoice.service.InvoiceService;
import com.etour.app.invoice.util.InvoicePdfGenerator;
import com.etour.app.repository.BookingHeaderRepository;
import com.etour.app.repository.PaymentRepository;
import com.etour.app.service.PaymentService;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepo;
    private final BookingHeaderRepository bookingRepository;
    private final InvoiceService invoiceService;
    private final EmailService emailService;

    public PaymentServiceImpl(PaymentRepository paymentRepo,
            BookingHeaderRepository bookingRepository, InvoiceService invoiceService,
            EmailService emailService) {
        this.paymentRepo = paymentRepo;
        this.bookingRepository = bookingRepository;
        this.invoiceService = invoiceService;
        this.emailService = emailService;
    }

    // ================= ADD PAYMENT =================
    @Override
    public PaymentDTO addPayment(PaymentDTO dto) {

        // ========== VALIDATION 1: Required Fields ==========
        if (dto.getBookingId() == null) {
            throw new RuntimeException("Booking ID is required");
        }

        if (dto.getTransactionId() == null || dto.getTransactionId().trim().isEmpty()) {
            throw new RuntimeException("Transaction ID is required");
        }

        if (dto.getPaymentStatus() == null || dto.getPaymentStatus().trim().isEmpty()) {
            throw new RuntimeException("Payment status is required");
        }

        if (dto.getPaidAmount() == null) {
            throw new RuntimeException("Paid amount is required");
        }

        // ========== VALIDATION 2: Booking Exists ==========
        BookingHeader booking = bookingRepository.findById(dto.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + dto.getBookingId()));

        // ========== VALIDATION 3: Prevent Duplicate Transaction ID ==========
        // NOTE: Transaction ID MUST be unique across ALL payments (not per booking)
        // This prevents accidental duplicate payment processing
        List<Payment> existingPayments = paymentRepo.findByTransactionId(dto.getTransactionId());
        if (!existingPayments.isEmpty()) {
            // If duplicates exist in database, provide detailed error message
            if (existingPayments.size() > 1) {
                String paymentIds = existingPayments.stream()
                        .map(p -> String.valueOf(p.getId()))
                        .reduce((a, b) -> a + ", " + b)
                        .orElse("");
                throw new RuntimeException(
                        "CRITICAL: Duplicate transaction IDs found in database! " +
                                "Transaction ID '" + dto.getTransactionId() + "' exists for Payment IDs: " + paymentIds
                                + ". " +
                                "This indicates data corruption. Please clean up duplicate records first.");
            } else {
                // Single existing payment - normal duplicate prevention
                throw new RuntimeException(
                        "Transaction ID already exists: " + dto.getTransactionId() +
                                ". Payment ID: " + existingPayments.get(0).getId() +
                                ", Booking ID: " + existingPayments.get(0).getBooking().getId());
            }
        }

        // ========== VALIDATION 4: Check if Booking Already Confirmed ==========
        boolean isAlreadyConfirmed = "CONFIRMED".equalsIgnoreCase(booking.getBookingStatus());

        // ========== VALIDATION 5: Amount Validation for SUCCESS Payments ==========
        if ("SUCCESS".equalsIgnoreCase(dto.getPaymentStatus())) {

            // Check if booking is already confirmed
            if (isAlreadyConfirmed) {
                // Check if there's already a successful payment
                List<Payment> existingSuccessfulPayments = paymentRepo.findByBookingId(dto.getBookingId())
                        .stream()
                        .filter(p -> "SUCCESS".equalsIgnoreCase(p.getPaymentStatus()))
                        .toList();

                if (!existingSuccessfulPayments.isEmpty()) {
                    throw new RuntimeException(
                            "Booking is already CONFIRMED with successful payment. " +
                                    "Cannot process another successful payment for booking ID: " + dto.getBookingId()
                                    + ". " +
                                    "Existing successful payment ID: " + existingSuccessfulPayments.get(0).getId());
                }
            }

            // Validate paid amount matches booking total amount (exact match required)
            if (dto.getPaidAmount().compareTo(booking.getTotalAmount()) != 0) {
                throw new RuntimeException(
                        String.format(
                                "Paid amount (%.2f) does not match booking total amount (%.2f) for booking ID: %d",
                                dto.getPaidAmount(),
                                booking.getTotalAmount(),
                                dto.getBookingId()));
            }
        }

        // ========== VALIDATION 6: For FAILED payments, amount should be 0 or less
        // ==========
        if ("FAILED".equalsIgnoreCase(dto.getPaymentStatus())) {
            if (dto.getPaidAmount().compareTo(java.math.BigDecimal.ZERO) > 0) {
                throw new RuntimeException(
                        "Failed payment cannot have paid amount greater than 0. " +
                                "Paid amount: " + dto.getPaidAmount()
                                + ". Set paid amount to 0.00 for failed payments.");
            }
        }

        // ========== CREATE PAYMENT ==========
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setTransactionId(dto.getTransactionId());
        payment.setPaymentMode(dto.getPaymentMode());
        payment.setPaymentStatus(dto.getPaymentStatus());
        payment.setPaidAmount(dto.getPaidAmount());
        payment.setRazorpayOrderId(dto.getRazorpayOrderId());
        payment.setRazorpayPaymentId(dto.getRazorpayPaymentId());
        payment.setRazorpaySignature(dto.getRazorpaySignature());

        Payment savedPayment = paymentRepo.save(payment);

        // ========== UPDATE BOOKING STATUS ==========
        // Only update to CONFIRMED if payment is SUCCESS and booking is currently
        // PENDING
        // This ensures:
        // 1. Failed payments don't change booking status
        // 2. Already confirmed bookings don't get updated unnecessarily
        boolean bookingJustConfirmed = false;

        if ("SUCCESS".equalsIgnoreCase(dto.getPaymentStatus())
                && !isAlreadyConfirmed) {

            booking.setBookingStatus("CONFIRMED");
            bookingRepository.save(booking);
            bookingJustConfirmed = true;
        }

        // ========== SEND INVOICE EMAIL (ONLY ON SUCCESS) ==========
        /*
         * WHY HERE?
         * - Payment SUCCESS is the source of truth
         * - Booking is already CONFIRMED
         * - Invoice generation is guaranteed to succeed
         * - Prevents duplicate emails
         */
        if (bookingJustConfirmed) {
            try {
                // 1️⃣ Generate Invoice DTO
                InvoiceResponseDTO invoice = invoiceService.generateInvoice(booking.getId().longValue());

                // 2️⃣ Generate Invoice PDF
                byte[] pdfBytes = InvoicePdfGenerator.generateInvoicePdf(invoice);

                // 3️⃣ Send Email via SendGrid
                String customerEmail = invoice.getCustomer().getEmail();

                emailService.sendInvoiceEmail(
                        customerEmail,
                        "Your E-Tour India Invoice – Booking #" + booking.getId(),
                        EmailTemplateUtil.invoiceEmailBody(
                                invoice.getCustomer().getName(),
                                booking.getId().longValue()),
                        pdfBytes,
                        "ETour-Invoice-" + booking.getId() + ".pdf");

            } catch (Exception e) {
                // Email failure should not affect payment confirmation
                e.printStackTrace();
            }
        }

        return toDTO(savedPayment);
    }

    // ================= GET BY ID =================
    @Override
    public PaymentDTO getPaymentById(Integer id) {
        return toDTO(paymentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + id)));
    }

    // ================= GET BY BOOKING =================
    @Override
    public List<PaymentDTO> getPaymentsByBooking(Integer bookingId) {
        return paymentRepo.findByBookingId(bookingId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // ================= UPDATE STATUS =================
    @Override
    public PaymentDTO updatePaymentStatus(Integer id, String status) {
        Payment p = paymentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + id));
        p.setPaymentStatus(status);
        return toDTO(paymentRepo.save(p));
    }

    // ================= GET BY TRANSACTION =================
    @Override
    public PaymentDTO getPaymentByTransactionId(String transactionId) {
        List<Payment> payments = paymentRepo.findByTransactionId(transactionId);

        if (payments.isEmpty()) {
            throw new RuntimeException("Payment not found for transaction id: " + transactionId);
        }

        // If multiple payments found with same transaction ID, this is a data integrity
        // issue
        if (payments.size() > 1) {
            String paymentIds = payments.stream()
                    .map(p -> String.valueOf(p.getId()))
                    .reduce((a, b) -> a + ", " + b)
                    .orElse("");
            throw new RuntimeException(
                    "CRITICAL: Multiple payments found with transaction ID '" + transactionId + "'. " +
                            "Payment IDs: " + paymentIds + ". " +
                            "This indicates duplicate data in the database. Please clean up duplicates.");
        }

        return toDTO(payments.get(0));
    }

    // ================= DELETE =================
    @Override
    public void deletePayment(Integer id) {
        if (!paymentRepo.existsById(id)) {
            throw new RuntimeException("Payment not found with ID: " + id);
        }
        paymentRepo.deleteById(id);
    }

    @Override
    public List<PaymentDTO> getAllPayments() {
        return paymentRepo.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // ================= ENTITY → DTO =================
    private PaymentDTO toDTO(Payment p) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(p.getId());
        dto.setBookingId(p.getBooking().getId());
        dto.setTransactionId(p.getTransactionId());
        dto.setPaymentMode(p.getPaymentMode());
        dto.setPaymentStatus(p.getPaymentStatus());
        dto.setPaidAmount(p.getPaidAmount());
        dto.setPaymentDate(p.getPaymentDate());
        dto.setRazorpayOrderId(p.getRazorpayOrderId());
        dto.setRazorpayPaymentId(p.getRazorpayPaymentId());
        dto.setRazorpaySignature(p.getRazorpaySignature());
        return dto;
    }
}
