package com.etour.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.etour.app.dto.BookingRequestDTO;
import com.etour.app.dto.BookingResponseDTO;
import com.etour.app.entity.BookingHeader;
import com.etour.app.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

	@Autowired
	private BookingService bookingService;

	// ==========================
	// CREATE BOOKING
	// ==========================

	@PostMapping("/create")
	public BookingHeader createBooking(@RequestBody BookingRequestDTO dto) {
		return bookingService.createBooking(dto);
	}

	// ==========================
	// GET BOOKINGS BY CUSTOMER
	// ==========================

	@GetMapping("/customer/{customerId}")
	public List<BookingResponseDTO> getCustomerBookings(@PathVariable Integer customerId) {
		return bookingService.getBookingsByCustomer(customerId);
	}

	// ==========================
	// GET BOOKING BY ID
	// ==========================

	@GetMapping("/{bookingId}")
	public BookingResponseDTO getBooking(@PathVariable Integer bookingId) {
		return bookingService.getBookingById(bookingId);
	}

	// ==========================
	// ✅ GET ALL BOOKINGS (ADMIN)
	// ==========================

	@GetMapping
	public List<BookingResponseDTO> getAllBookings() {
		return bookingService.getAllBookings();
	}

	// ==========================
	// CANCEL BOOKING
	// ==========================

	@DeleteMapping("/{bookingId}")
	public String cancelBooking(@PathVariable Integer bookingId) {
		bookingService.cancelBooking(bookingId);
		return "Booking Cancelled Successfully";
	}
}
