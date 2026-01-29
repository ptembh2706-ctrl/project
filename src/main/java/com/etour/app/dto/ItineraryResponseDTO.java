package com.etour.app.dto;

public class ItineraryResponseDTO {
	private Integer dayNumber;
	private String itineraryDetails;
    private String categoryId;

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

	public String getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(String categoryId) {
		this.categoryId = categoryId;
	}			
}