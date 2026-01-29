package com.etour.app.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "itinerary_master")
public class ItineraryMaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "itinerary_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "catmaster_id", nullable = false)
    private CategoryMaster catmaster;

    @Column(name = "day_number", nullable = false)
    private Integer dayNumber;

    @Lob
    @Column(name = "itinerary_details", nullable = false)
    private String itineraryDetails;

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

    public Integer getDayNumber() {
        return dayNumber;
    }

    public void setDayNumber(Integer dayNumber) {
        this.dayNumber = dayNumber;
    }

    public String getItineraryDetails() {
        return itineraryDetails;
    }

    public void setItineraryDetails(String itineraryDetails) {
        this.itineraryDetails = itineraryDetails;
    }

}