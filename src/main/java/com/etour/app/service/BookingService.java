package com.etour.app.service;

import java.util.List;

import com.etour.app.dto.BookingRequestDTO;
import com.etour.app.dto.BookingResponseDTO;
import com.etour.app.entity.BookingHeader;

public interface BookingService {

    BookingHeader createBooking(BookingRequestDTO dto);  // Keep as BookingHeader for create

    List<BookingResponseDTO> getBookingsByCustomer(Integer customerId);

    BookingResponseDTO getBookingById(Integer bookingId);

    List<BookingResponseDTO> getAllBookings();

    void cancelBooking(Integer bookingId);
}