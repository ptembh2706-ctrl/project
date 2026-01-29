package com.etour.app.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "booking_addon_master")
public class BookingAddonMaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_addon_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private BookingHeader booking;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "addon_id", nullable = false)
    private AddonOnMaster addon;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "addon_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal addonAmount;

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

    public AddonOnMaster getAddon() {
        return addon;
    }

    public void setAddon(AddonOnMaster addon) {
        this.addon = addon;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getAddonAmount() {
        return addonAmount;
    }

    public void setAddonAmount(BigDecimal addonAmount) {
        this.addonAmount = addonAmount;
    }

}