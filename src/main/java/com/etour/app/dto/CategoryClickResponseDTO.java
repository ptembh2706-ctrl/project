package com.etour.app.dto;

import java.util.List;

import com.etour.app.entity.CategoryMaster;

public class CategoryClickResponseDTO {
	private String responseType; // "SUBCATEGORIES" | "TOUR"
	private List<CategoryMaster> subcategories;
	private TourDTO tour;

	public String getResponseType() {
		return responseType;
	}

	public void setResponseType(String responseType) {
		this.responseType = responseType;
	}

	public List<CategoryMaster> getSubcategories() {
		return subcategories;
	}

	public void setSubcategories(List<CategoryMaster> subcategories) {
		this.subcategories = subcategories;
	}

	public TourDTO getTour() {
		return tour;
	}

	public void setTour(TourDTO tour) {
		this.tour = tour;
	}
}
