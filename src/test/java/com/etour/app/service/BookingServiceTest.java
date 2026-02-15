package com.etour.app.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.etour.app.dto.BookingRequestDTO;
import com.etour.app.dto.BookingResponseDTO;
import com.etour.app.dto.PassengerDTO;
import com.etour.app.entity.*;
import com.etour.app.repository.*;
import com.etour.app.service.impl.BookingServiceImpl;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    // ================= SERVICE =================
    @InjectMocks
    private BookingServiceImpl bookingService;

    // ================= MOCKS =================
    @Mock private BookingHeaderRepository bookingRepo;
    @Mock private PassengerRepository passengerRepo;
    @Mock private CustomerRepository customerRepo;
    @Mock private TourRepository tourRepo;
    @Mock private DepartureDateRepository departureRepo;
    @Mock private CostRepository costRepo;

    // ================= TEST DATA =================
    private CustomerMaster customer;
    private CategoryMaster category;
    private TourMaster tour;
    private DepartureDateMaster departure;
    private CostMaster cost;

    @BeforeEach
    void setup() {

        customer = new CustomerMaster();
        customer.setId(1);
        customer.setName("John Doe");

        category = new CategoryMaster();
        category.setId(10);
        category.setName("Honeymoon");

        departure = new DepartureDateMaster();
        departure.setId(50);
        departure.setDepartureDate(LocalDate.now().plusDays(30));
        departure.setEndDate(LocalDate.now().plusDays(35));
        departure.setNumberOfDays(5);
        departure.setCatmaster(category);

        tour = new TourMaster();
        tour.setId(100);
        tour.setDescription("Bali Trip");
        tour.setCatmaster(category);

        cost = new CostMaster();
        cost.setId(200);
        cost.setCatmaster(category);
        cost.setBaseCost(new BigDecimal("20000"));
        cost.setSinglePersonCost(new BigDecimal("30000"));
        cost.setExtraPersonCost(new BigDecimal("8500"));
        cost.setChildWithBedCost(new BigDecimal("8000"));
        cost.setChildWithoutBedCost(new BigDecimal("5000"));
    }

    // =====================================================
    // TEST 1: CREATE BOOKING - SUCCESS
    // =====================================================
    @Test
    void testCreateBooking_Success() {

        // -------- Arrange --------
        BookingRequestDTO req = new BookingRequestDTO();
        req.setCustomerId(1);
        req.setTourId(100);
        req.setDepartureDateId(50);
        req.setRoomPreference("AUTO");

        PassengerDTO p1 = new PassengerDTO();
        p1.setPassengerName("Alice");
        p1.setDateOfBirth(LocalDate.of(1990, 1, 1)); // Adult

        PassengerDTO p2 = new PassengerDTO();
        p2.setPassengerName("Bob");
        p2.setDateOfBirth(LocalDate.of(1995, 1, 1)); // Adult

        req.setPassengers(List.of(p1, p2));

        when(customerRepo.findById(1)).thenReturn(Optional.of(customer));
        when(departureRepo.findById(50)).thenReturn(Optional.of(departure));
        when(tourRepo.findById(100)).thenReturn(Optional.of(tour));
        when(costRepo.findByCatmaster_Id(10)).thenReturn(List.of(cost));

        BookingHeader savedBooking = new BookingHeader();
        savedBooking.setId(999);

        when(bookingRepo.save(any(BookingHeader.class))).thenReturn(savedBooking);

        // -------- Act --------
        BookingHeader result = bookingService.createBooking(req);

        // -------- Assert --------
        assertNotNull(result);
        assertEquals(999, result.getId());
        assertEquals(2, result.getTotalPassengers());
        assertNotNull(result.getTotalAmount());
        assertTrue(result.getTotalAmount().compareTo(BigDecimal.ZERO) > 0);

        // -------- Verify --------
        verify(customerRepo).findById(1);
        verify(departureRepo).findById(50);
        verify(costRepo).findByCatmaster_Id(10);
        verify(bookingRepo).save(any(BookingHeader.class));

        verify(passengerRepo, times(2))
                .save(argThat(p -> p.getBooking() != null));
    }

    // =====================================================
    // TEST 2: CUSTOMER NOT FOUND
    // =====================================================
    @Test
    void testCreateBooking_CustomerNotFound() {

        BookingRequestDTO req = new BookingRequestDTO();
        req.setCustomerId(1);

        when(customerRepo.findById(1)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> bookingService.createBooking(req));

        verify(customerRepo).findById(1);
        verifyNoInteractions(bookingRepo, passengerRepo);
    }

    // =====================================================
    // TEST 3: GET BOOKING BY ID
    // =====================================================
    @Test
    void testGetBookingById_Success() {

        BookingHeader booking = new BookingHeader();
        booking.setId(999);
        booking.setBookingStatus("CONFIRMED");
        booking.setCustomer(customer);
        booking.setTour(tour);
        booking.setDepartureDate(departure);

        when(bookingRepo.findByIdWithDetails(999))
                .thenReturn(Optional.of(booking));

        BookingResponseDTO response = bookingService.getBookingById(999);

        assertEquals(999, response.getId());
        assertEquals("CONFIRMED", response.getBookingStatus());
        assertEquals("John Doe", response.getCustomerName());
        assertEquals("Bali Trip", response.getTourDescription());

        verify(bookingRepo).findByIdWithDetails(999);
    }
}
