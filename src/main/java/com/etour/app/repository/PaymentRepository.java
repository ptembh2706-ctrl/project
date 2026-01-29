package com.etour.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.etour.app.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

	@Query("SELECT p FROM Payment p WHERE p.booking.id = :bookingId")
    List<Payment> findByBookingId(@Param("bookingId") Integer bookingId);

    @Query("SELECT p FROM Payment p WHERE p.transactionId = :transactionId")
    List<Payment> findByTransactionId(@Param("transactionId") String transactionId);
}
