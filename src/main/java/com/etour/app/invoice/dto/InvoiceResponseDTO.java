package com.etour.app.invoice.dto;

import java.time.LocalDateTime;
import java.util.List;

public class InvoiceResponseDTO {

    private String invoiceNumber;
    private LocalDateTime invoiceDate;

    private InvoiceBookingDTO booking;
    private InvoiceCustomerDTO customer;
    private InvoiceTourDTO tour;
    private InvoiceDepartureDTO departure;
    private List<InvoicePassengerDTO> passengers;
    private InvoicePaymentDTO payment;
    private InvoiceAmountDTO amount;

    public InvoiceResponseDTO() {}

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public LocalDateTime getInvoiceDate() {
        return invoiceDate;
    }

    public void setInvoiceDate(LocalDateTime invoiceDate) {
        this.invoiceDate = invoiceDate;
    }

    public InvoiceBookingDTO getBooking() {
        return booking;
    }

    public void setBooking(InvoiceBookingDTO booking) {
        this.booking = booking;
    }

    public InvoiceCustomerDTO getCustomer() {
        return customer;
    }

    public void setCustomer(InvoiceCustomerDTO customer) {
        this.customer = customer;
    }

    public InvoiceTourDTO getTour() {
        return tour;
    }

    public void setTour(InvoiceTourDTO tour) {
        this.tour = tour;
    }

    public InvoiceDepartureDTO getDeparture() {
        return departure;
    }

    public void setDeparture(InvoiceDepartureDTO departure) {
        this.departure = departure;
    }

    public List<InvoicePassengerDTO> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<InvoicePassengerDTO> passengers) {
        this.passengers = passengers;
    }

    public InvoicePaymentDTO getPayment() {
        return payment;
    }

    public void setPayment(InvoicePaymentDTO payment) {
        this.payment = payment;
    }

    public InvoiceAmountDTO getAmount() {
        return amount;
    }

    public void setAmount(InvoiceAmountDTO amount) {
        this.amount = amount;
    }
}
