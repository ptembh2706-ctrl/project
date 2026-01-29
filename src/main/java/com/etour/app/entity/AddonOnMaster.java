package com.etour.app.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "addon_on_master")
public class AddonOnMaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "addon_id", nullable = false)
    private Integer id;

    @Column(name = "addon_name", nullable = false)
    private String addonName;

    @Column(name = "description")
    private String description;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @OneToMany(mappedBy = "addon")
    private Set<BookingAddonMaster> bookingAddonMasters = new LinkedHashSet<>();

    @OneToMany(mappedBy = "addon")
    private Set<TourAddonMaster> tourAddonMasters = new LinkedHashSet<>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getAddonName() {
        return addonName;
    }

    public void setAddonName(String addonName) {
        this.addonName = addonName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Set<BookingAddonMaster> getBookingAddonMasters() {
        return bookingAddonMasters;
    }

    public void setBookingAddonMasters(Set<BookingAddonMaster> bookingAddonMasters) {
        this.bookingAddonMasters = bookingAddonMasters;
    }

    public Set<TourAddonMaster> getTourAddonMasters() {
        return tourAddonMasters;
    }

    public void setTourAddonMasters(Set<TourAddonMaster> tourAddonMasters) {
        this.tourAddonMasters = tourAddonMasters;
    }

}