package com.etour.app.service.impl;

import com.etour.app.entity.PassengerMaster;
import com.etour.app.repository.PassengerRepository;
import com.etour.app.service.PassengerService;
import org.springframework.stereotype.Service;
import com.etour.app.dto.PassengerResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class PassengerServiceImpl implements PassengerService {

    @Autowired
    private PassengerRepository passengerRepository;

    @Override
    public PassengerMaster addPassenger(PassengerMaster passenger) {
        return passengerRepository.save(passenger);
    }
    
    @Override
    public PassengerMaster getPassengerById(int passengerId) {
        return passengerRepository.findById(passengerId).orElse(null);
    }

    @Override
    public List<PassengerResponseDTO> getAllPassengers() {
        return passengerRepository.findAll()
            .stream()
            .map(passenger -> {
                PassengerResponseDTO dto = new PassengerResponseDTO();
                dto.setPassengerId(passenger.getId());
                dto.setPassengerName(passenger.getPassengerName());
                dto.setPassengerType(passenger.getPassengerType());
                dto.setPassengerAmount(passenger.getPassengerAmount());
                return dto;
            })
            .toList();
    }

    @Override
    public List<PassengerResponseDTO> getPassengersByBookingId(int bookingId) {
    	List<PassengerMaster> passengers = passengerRepository.findPassengersByBookingId(bookingId);

    	return passengers.stream().map(passenger -> {
    		PassengerResponseDTO dto = new PassengerResponseDTO();
            dto.setPassengerId(passenger.getId());
    		dto.setPassengerName(passenger.getPassengerName());
    		dto.setPassengerType(passenger.getPassengerType());
    		dto.setPassengerAmount(passenger.getPassengerAmount());
    		return dto;
    	}).toList();
    }

   

    @Override
    public void deletePassenger(int passengerId) {
        PassengerMaster p = passengerRepository.findById(passengerId).orElseThrow();
        passengerRepository.delete(p);
    }

    

}
