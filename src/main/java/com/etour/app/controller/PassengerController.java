package com.etour.app.controller;

import com.etour.app.entity.PassengerMaster;
import com.etour.app.service.PassengerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.etour.app.dto.PassengerResponseDTO;

@RestController
@RequestMapping("/api/passengers")
public class PassengerController {

    @Autowired
    private PassengerService passengerService;

    @GetMapping
    public ResponseEntity<List<PassengerResponseDTO>> getAllPassengers() {
        List<PassengerResponseDTO> passengers = passengerService.getAllPassengers();
        return ResponseEntity.ok(passengers);
    }

    @PostMapping("/add")
    public ResponseEntity<PassengerMaster> addPassenger(@RequestBody PassengerMaster passenger) {
        return ResponseEntity.ok(passengerService.addPassenger(passenger));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<PassengerResponseDTO>> getByBookingId(@PathVariable Integer bookingId) {
        List<PassengerResponseDTO> passengers = passengerService.getPassengersByBookingId(bookingId);
        return ResponseEntity.ok(passengers);
    }
    
    @GetMapping("/{passengerId}")
    public PassengerMaster getPassengerById(@PathVariable int passengerId) {
        return passengerService.getPassengerById(passengerId);
    }

    @DeleteMapping("/{passengerId}")
    public ResponseEntity<String> deletePassenger(@PathVariable Integer passengerId) {
        passengerService.deletePassenger(passengerId);
        return ResponseEntity.ok("Passenger deleted");
    }
}
