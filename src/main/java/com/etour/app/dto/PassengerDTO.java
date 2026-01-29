package com.etour.app.dto;

import java.time.LocalDate;

public class PassengerDTO {

	private String name;
	private LocalDate dob;

	public String getPassengerName() {
		return name;
	}

	public void setPassengerName(String name) {
		this.name = name;
	}

	public LocalDate getDateOfBirth() {
		return dob;
	}

	public void setDateOfBirth(LocalDate dob) {
		this.dob = dob;
	}
}
