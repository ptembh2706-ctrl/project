package com.etour.app.service;

import java.util.List;

import com.etour.app.entity.PassengerMaster;	
import com.etour.app.dto.PassengerResponseDTO;

public interface PassengerService {
	
	 PassengerMaster addPassenger(PassengerMaster passenger);

	    List<PassengerResponseDTO> getAllPassengers();

	    List<PassengerResponseDTO> getPassengersByBookingId(int bookingId);


	    void deletePassenger(int passengerId);
	    
	    PassengerMaster getPassengerById(int passengerId);


}
