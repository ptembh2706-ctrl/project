package com.etour.app.service;

import java.util.List;

import com.etour.app.dto.PaymentDTO;

public interface PaymentService {

    PaymentDTO addPayment(PaymentDTO dto);

    PaymentDTO getPaymentById(Integer id);

    List<PaymentDTO> getPaymentsByBooking(Integer bookingId);

    PaymentDTO updatePaymentStatus(Integer id, String status);

    PaymentDTO getPaymentByTransactionId(String transactionId);

    void deletePayment(Integer id);

    List<PaymentDTO> getAllPayments();
}
