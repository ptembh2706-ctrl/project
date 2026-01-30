package com.etour.app.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SearchResultDTO {
    private Integer tourId;
    private Integer catmasterId;
    private String tourName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer duration;
    private BigDecimal tourCost;
    private String imagePath;

    public SearchResultDTO(Integer tourId, Integer catmasterId, String tourName, LocalDate startDate, LocalDate endDate,
            Integer duration, BigDecimal tourCost, String imagePath) { // Updated Constructor
        this.tourId = tourId;
        this.catmasterId = catmasterId;
        this.tourName = tourName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.duration = duration;
        this.tourCost = tourCost;
        this.imagePath = imagePath;
    }

    public SearchResultDTO() {
    }

    // Getters and Setters
    public Integer getTourId() {
        return tourId;
    }

    public void setTourId(Integer tourId) {
        this.tourId = tourId;
    }

    public Integer getCatmasterId() {
        return catmasterId;
    }

    public void setCatmasterId(Integer catmasterId) {
        this.catmasterId = catmasterId;
    }

    public String getTourName() {
        return tourName;
    }

    public void setTourName(String tourName) {
        this.tourName = tourName;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public BigDecimal getTourCost() {
        return tourCost;
    }

    public void setTourCost(BigDecimal tourCost) {
        this.tourCost = tourCost;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
}