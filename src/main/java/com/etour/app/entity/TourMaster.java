package com.etour.app.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tour_master")
public class TourMaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tour_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "catmaster_id", nullable = false)
    private CategoryMaster catmaster;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "departure_date_id", nullable = false)
    private DepartureDateMaster departureDate;

    @Column(name = "description", length = 500)
    private String description;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public CategoryMaster getCatmaster() {
        return catmaster;
    }

    public void setCatmaster(CategoryMaster catmaster) {
        this.catmaster = catmaster;
    }

    public DepartureDateMaster getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(DepartureDateMaster departureDate) {
        this.departureDate = departureDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}