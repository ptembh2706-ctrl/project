package com.etour.app.dto;

import java.math.BigDecimal;
import java.util.List;

public class TourDTO 
{
	private Integer catmasterId;
	private String tourName;
	private String description;
	private Integer numberOfDays; // for overview (can be derived from first available date)

	// quick overview (kept for your current UI)
	private BigDecimal baseCost;

	// full pricing + schedule + itinerary
	private List<CostDTO> costs;
	private List<DepartureDateDTO> availableDates;
	private List<ItineraryResponseDTO> itinerary;

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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Integer getNumberOfDays() {
		return numberOfDays;
	}

	public void setNumberOfDays(Integer numberOfDays) {
		this.numberOfDays = numberOfDays;
	}

	public BigDecimal getBaseCost() {
		return baseCost;
	}

	public void setBaseCost(BigDecimal baseCost) {
		this.baseCost = baseCost;
	}

	public List<CostDTO> getCosts() {
		return costs;
	}

	public void setCosts(List<CostDTO> costs) {
		this.costs = costs;
	}

	public List<DepartureDateDTO> getAvailableDates() {
		return availableDates;
	}

	public void setAvailableDates(List<DepartureDateDTO> availableDates) {
		this.availableDates = availableDates;
	}

	public List<ItineraryResponseDTO> getItinerary() {
		return itinerary;
	}

	public void setItinerary(List<ItineraryResponseDTO> itinerary) {
		this.itinerary = itinerary;
	}
}
