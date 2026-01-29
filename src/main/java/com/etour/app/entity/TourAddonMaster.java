package com.etour.app.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tour_addon_master")
public class TourAddonMaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tour_addon_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tour_id", nullable = false)
    private TourMaster tour;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "addon_id", nullable = false)
    private AddonOnMaster addon;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public TourMaster getTour() {
        return tour;
    }

    public void setTour(TourMaster tour) {
        this.tour = tour;
    }

    public AddonOnMaster getAddon() {
        return addon;
    }

    public void setAddon(AddonOnMaster addon) {
        this.addon = addon;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

}