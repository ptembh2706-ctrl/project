package com.etour.app.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "passenger_master")
public class PassengerMaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "passenger_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private BookingHeader booking;

    @Column(name = "passenger_name", nullable = false, length = 100)
    private String passengerName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "passenger_type", nullable = false, length = 30)
    private String passengerType;

    @Column(name = "passenger_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal passengerAmount;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public BookingHeader getBooking() {
        return booking;
    }

    public void setBooking(BookingHeader booking) {
        this.booking = booking;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPassengerType() {
        return passengerType;
    }

    public void setPassengerType(String passengerType) {
        this.passengerType = passengerType;
    }

    public BigDecimal getPassengerAmount() {
        return passengerAmount;
    }

    public void setPassengerAmount(BigDecimal passengerAmount) {
        this.passengerAmount = passengerAmount;
    }

}