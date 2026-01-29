package com.etour.app.invoice.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.etour.app.exception.InvoiceNotAllowedException;
import com.etour.app.invoice.dto.*;
import com.etour.app.invoice.service.InvoiceService;
import com.etour.app.repository.BookingHeaderRepository;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    private final BookingHeaderRepository bookingHeaderRepository;

    public InvoiceServiceImpl(BookingHeaderRepository bookingHeaderRepository) {
        this.bookingHeaderRepository = bookingHeaderRepository;
    }

    @Override
    public InvoiceResponseDTO generateInvoice(Long bookingId) {

        List<Object[]> rows = bookingHeaderRepository.fetchInvoiceData(bookingId);

        if (rows == null || rows.isEmpty()) {
        	throw new InvoiceNotAllowedException(
        	        "Invoice allowed only for CONFIRMED booking with SUCCESS payment"
        	    );
        }

        Object[] r = rows.get(0);

        InvoiceResponseDTO invoice = new InvoiceResponseDTO();
        invoice.setInvoiceNumber(generateInvoiceNumber(bookingId));
        invoice.setInvoiceDate(LocalDateTime.now());

        // ---------- BOOKING ----------
        InvoiceBookingDTO booking = new InvoiceBookingDTO();
        booking.setBookingId(((Number) r[0]).longValue());
        booking.setBookingDate((LocalDate) r[1]);
        booking.setBookingStatus((String) r[2]);
        booking.setTotalPassengers(((Number) r[3]).intValue());
        invoice.setBooking(booking);

        // ---------- AMOUNT ----------
        InvoiceAmountDTO amount = new InvoiceAmountDTO();
        amount.setTourAmount((BigDecimal) r[4]);
        amount.setTaxAmount((BigDecimal) r[5]);
        amount.setTotalAmount((BigDecimal) r[6]);
        amount.setCurrency("INR");
        invoice.setAmount(amount);

        // ---------- CUSTOMER ----------
        InvoiceCustomerDTO customer = new InvoiceCustomerDTO();
        customer.setCustomerId(((Number) r[7]).longValue());
        customer.setName((String) r[8]);
        customer.setEmail((String) r[9]);
        customer.setMobileNumber((String) r[10]);
        invoice.setCustomer(customer);

        // ---------- TOUR ----------
        InvoiceTourDTO tour = new InvoiceTourDTO();
        tour.setTourId(((Number) r[11]).longValue());
        tour.setDescription((String) r[12]);
        invoice.setTour(tour);

        // ---------- DEPARTURE ----------
        InvoiceDepartureDTO departure = new InvoiceDepartureDTO();
        departure.setDepartureDate((LocalDate) r[13]);
        departure.setEndDate((LocalDate) r[14]);
        departure.setNumberOfDays(((Number) r[15]).intValue());
        invoice.setDeparture(departure);

        // ---------- PAYMENT ----------
        InvoicePaymentDTO payment = new InvoicePaymentDTO();
        payment.setPaymentMode((String) r[16]);
        payment.setPaymentStatus((String) r[17]);
        payment.setTransactionId((String) r[18]);
        payment.setPaymentDate((LocalDateTime) r[19]);
        invoice.setPayment(payment);

        // ---------- PASSENGERS ----------
        List<InvoicePassengerDTO> passengers = new ArrayList<>();
        for (Object[] row : rows) {
            if (row[20] != null) {
                InvoicePassengerDTO p = new InvoicePassengerDTO();
                p.setPassengerName((String) row[20]);
                p.setPassengerType((String) row[21]);
                p.setPassengerAmount((BigDecimal) row[22]);
                passengers.add(p);
            }
        }
        invoice.setPassengers(passengers);

        return invoice;
    }

    private String generateInvoiceNumber(Long bookingId) {
        return "INV-" + LocalDateTime.now().getYear() + "-" + bookingId;
    }
}
