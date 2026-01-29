package com.etour.app.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CostDTO {
	private BigDecimal baseCost;
	private BigDecimal singlePersonCost;
	private BigDecimal extraPersonCost;
	private BigDecimal childWithBedCost;
	private BigDecimal childWithoutBedCost;
	private LocalDate validFromDate;
	private LocalDate validToDate;

	public BigDecimal getBaseCost() {
		return baseCost;
	}

	public void setBaseCost(BigDecimal baseCost) {
		this.baseCost = baseCost;
	}

	public BigDecimal getSinglePersonCost() {
		return singlePersonCost;
	}

	public void setSinglePersonCost(BigDecimal singlePersonCost) {
		this.singlePersonCost = singlePersonCost;
	}

	public BigDecimal getExtraPersonCost() {
		return extraPersonCost;
	}

	public void setExtraPersonCost(BigDecimal extraPersonCost) {
		this.extraPersonCost = extraPersonCost;
	}

	public BigDecimal getChildWithBedCost() {
		return childWithBedCost;
	}

	public void setChildWithBedCost(BigDecimal childWithBedCost) {
		this.childWithBedCost = childWithBedCost;
	}

	public BigDecimal getChildWithoutBedCost() {
		return childWithoutBedCost;
	}

	public void setChildWithoutBedCost(BigDecimal childWithoutBedCost) {
		this.childWithoutBedCost = childWithoutBedCost;
	}

	public LocalDate getValidFromDate() {
		return validFromDate;
	}

	public void setValidFromDate(LocalDate validFromDate) {
		this.validFromDate = validFromDate;
	}

	public LocalDate getValidToDate() {
		return validToDate;
	}

	public void setValidToDate(LocalDate validToDate) {
		this.validToDate = validToDate;
	}
}
