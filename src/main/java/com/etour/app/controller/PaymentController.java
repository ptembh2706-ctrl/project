package com.etour.app.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.etour.app.dto.PaymentDTO;
import com.etour.app.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public PaymentDTO addPayment(@RequestBody PaymentDTO dto) {
        return paymentService.addPayment(dto);
    }

    @GetMapping
    public List<PaymentDTO> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public PaymentDTO getPayment(@PathVariable Integer id) {
        return paymentService.getPaymentById(id);
    }

    @GetMapping("/booking/{bookingId}")
    public List<PaymentDTO> getByBooking(@PathVariable Integer bookingId) {
        return paymentService.getPaymentsByBooking(bookingId);
    }

    @PutMapping("/{id}/status/{status}")
    public PaymentDTO updateStatus(@PathVariable Integer id,
            @PathVariable String status) {
        return paymentService.updatePaymentStatus(id, status);
    }

    @GetMapping("/transaction/{txn}")
    public PaymentDTO getByTransaction(@PathVariable String txn) {
        return paymentService.getPaymentByTransactionId(txn);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        paymentService.deletePayment(id);
        return "Payment deleted successfully";
    }
}
