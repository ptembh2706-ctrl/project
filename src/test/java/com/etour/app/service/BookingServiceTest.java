package com.etour.app.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
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
public class BookingServiceTest {

    // ====== SERVICE ======
    @InjectMocks
    private BookingServiceImpl bookingService;

    // ====== MOCKED REPOSITORIES ======
    @Mock
    private BookingHeaderRepository bookingRepo;
    @Mock
    private PassengerRepository passengerRepo;
    @Mock
    private CustomerRepository customerRepo;
    @Mock
    private TourRepository tourRepo;
    @Mock
    private DepartureDateRepository departureRepo;
    @Mock
    private CostRepository costRepo;

    // ====== COMMON TEST DATA ======
    private CustomerMaster customer;
    private TourMaster tour;
    private DepartureDateMaster departure;
    private CategoryMaster category;
    private CostMaster cost;

    @BeforeEach
    void setUp() {

        customer = new CustomerMaster();
        customer.setId(1);
        customer.setName("John Doe");

        category = new CategoryMaster();
        category.setId(10);
        category.setName("Honeymoon");

        tour = new TourMaster();
        tour.setId(100);
        tour.setCatmaster(category);
        tour.setDescription("Bali Trip");

        departure = new DepartureDateMaster();
        departure.setId(50);
        departure.setDepartureDate(LocalDate.now().plusDays(10));
        departure.setEndDate(LocalDate.now().plusDays(15));
        departure.setNumberOfDays(5);

        cost = new CostMaster();
        cost.setId(200);
        cost.setCatmaster(category);
        cost.setBaseCost(new BigDecimal("50000"));
        cost.setSinglePersonCost(new BigDecimal("30000"));
        cost.setExtraPersonCost(new BigDecimal("10000"));
        cost.setChildWithBedCost(new BigDecimal("8000"));
        cost.setChildWithoutBedCost(new BigDecimal("5000"));
    }

    // =========================================================
    // TEST 1: CREATE BOOKING - SUCCESS
    // =========================================================
    @Test
    void testCreateBooking_Success() {

        BookingRequestDTO req = new BookingRequestDTO();
        req.setCustomerId(1);
        req.setTourId(100);
        req.setDepartureDateId(50);
        req.setRoomPreference("AUTO");

        List<PassengerDTO> passengers = new ArrayList<>();

        PassengerDTO p1 = new PassengerDTO();
        p1.setPassengerName("Alice");
        p1.setDateOfBirth(LocalDate.of(1990, 10, 1));

        PassengerDTO p2 = new PassengerDTO();
        p2.setPassengerName("Bob");
        p2.setDateOfBirth(LocalDate.of(2000, 1, 12));

        passengers.add(p1);
        passengers.add(p2);
        req.setPassengers(passengers);

        when(customerRepo.findById(1)).thenReturn(Optional.of(customer));
        when(tourRepo.findById(100)).thenReturn(Optional.of(tour));
        when(departureRepo.findById(50)).thenReturn(Optional.of(departure));
        when(costRepo.findAll()).thenReturn(List.of(cost));

        BookingHeader savedBooking = new BookingHeader();
        savedBooking.setId(999);

        when(bookingRepo.save(any(BookingHeader.class)))
                .thenReturn(savedBooking);

        BookingHeader result = bookingService.createBooking(req);

        assertNotNull(result);
        assertEquals(999, result.getId());

        verify(customerRepo).findById(1);
        verify(tourRepo).findById(100);
        verify(departureRepo).findById(50);
        verify(costRepo).findAll();
        verify(bookingRepo).save(any(BookingHeader.class));
        verify(passengerRepo, times(2)).save(any(PassengerMaster.class));
    }

    // =========================================================
    // TEST 2: GET BOOKING BY ID - SUCCESS
    // =========================================================
    @Test
    void testGetBookingById_Success() {

        BookingHeader booking = new BookingHeader();
        booking.setId(999);
        booking.setBookingStatus("CONFIRMED");
        booking.setCustomer(customer);
        booking.setTour(tour);
        booking.setDepartureDate(departure);

        // MODIFIED: mocking findByIdWithDetails instead of findById
        when(bookingRepo.findByIdWithDetails(999))
                .thenReturn(Optional.of(booking));

        BookingResponseDTO response = bookingService.getBookingById(999);

        assertNotNull(response);
        assertEquals(999, response.getId());
        assertEquals("CONFIRMED", response.getBookingStatus());
        assertEquals("John Doe", response.getCustomerName());
        assertEquals("Bali Trip", response.getTourDescription());

        verify(bookingRepo).findByIdWithDetails(999);
    }
}
