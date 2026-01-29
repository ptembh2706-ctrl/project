package com.etour.app.invoice.dto;

public class InvoiceTourDTO {

    private Long tourId;
    private String description;

    public Long getTourId() {
        return tourId;
    }

    public void setTourId(Long tourId) {
        this.tourId = tourId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
