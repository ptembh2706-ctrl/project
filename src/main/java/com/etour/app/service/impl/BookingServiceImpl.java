package com.etour.app.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.etour.app.dto.BookingRequestDTO;
import com.etour.app.dto.BookingResponseDTO;
import com.etour.app.dto.PassengerDTO;
import com.etour.app.entity.*;
import com.etour.app.repository.*;
import com.etour.app.service.BookingService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingHeaderRepository bookingRepo;

    @Autowired
    private PassengerRepository passengerRepo;

    @Autowired
    private CustomerRepository customerRepo;

    @Autowired
    private TourRepository tourRepo;

    @Autowired
    private DepartureDateRepository departureRepo;

    @Autowired
    private CostRepository costRepo;

    // =================================================
    // 1️⃣ CREATE BOOKING
    // =================================================

    @Override
    public BookingHeader createBooking(BookingRequestDTO dto) {

        System.out.println("DEBUG: Processing Booking Request");
        System.out.println("DEBUG: Customer ID: " + dto.getCustomerId());
        System.out.println("DEBUG: Tour ID: " + dto.getTourId());
        System.out.println("DEBUG: DepartureDate ID: " + dto.getDepartureDateId());
        System.out.println("DEBUG: Room Preference: " + dto.getRoomPreference());
        if (dto.getPassengers() != null) {
            System.out.println("DEBUG: Passenger Count: " + dto.getPassengers().size());
            dto.getPassengers().forEach(p -> System.out
                    .println("DEBUG: Passenger: " + p.getPassengerName()
                            + " DOB: " + p.getDateOfBirth()
                            + " Gender: " + p.getGender()
                            + " Type: " + p.getPassengerType()));
        } else {
            System.out.println("DEBUG: Passengers list is NULL");
        }

        // ---------------- FETCH MASTER DATA ----------------

        if (dto.getCustomerId() == null) {
            throw new RuntimeException("Customer ID is missing in request");
        }
        CustomerMaster customer = customerRepo.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + dto.getCustomerId()));

        // Departure date is the authoritative source for category
        DepartureDateMaster departure = departureRepo.findById(dto.getDepartureDateId())
                .orElseThrow(
                        () -> new RuntimeException("Departure Date not found with ID: " + dto.getDepartureDateId()));

        // Get category from departure date (reliable) - NOT from tour (unreliable)
        CategoryMaster category = departure.getCatmaster();
        System.out.println(
                "DEBUG: Category from departure date: " + category.getId() + " - " + category.getName());

        // Tour is optional, try to find it for description purposes
        TourMaster tour = null;
        if (dto.getTourId() != null) {
            tour = tourRepo.findById(dto.getTourId()).orElse(null);
        }
        if (tour == null) {
            // Fallback: find any tour with this departure date
            tour = tourRepo.findAll().stream()
                    .filter(t -> t.getDepartureDate() != null
                            && t.getDepartureDate().getId().equals(dto.getDepartureDateId()))
                    .findFirst()
                    .orElse(null);
        }

        // ---------------- FETCH COST ----------------
        // Use category from DEPARTURE DATE (reliable), not from tour
        List<CostMaster> costs = costRepo.findByCatmaster_Id(category.getId());

        if (costs.isEmpty()) {
            throw new RuntimeException("Cost not configured for Category ID: " + category.getId());
        }

        // Assuming there's one active cost or picking the first one
        // Ideally we should filter by valid dates as well
        CostMaster cost = costs.get(0);

        // Debug: Print all cost values to verify correct row is being used
        System.out.println("DEBUG: ============ COST MASTER VALUES ============");
        System.out.println("DEBUG: Cost ID: " + cost.getId());
        System.out.println("DEBUG: Category ID: " + cost.getCatmaster().getId());
        System.out.println("DEBUG: Base Cost (per-person twin): " + cost.getBaseCost());
        System.out.println("DEBUG: Single Person Cost: " + cost.getSinglePersonCost());
        System.out.println("DEBUG: Extra Person Cost (triple): " + cost.getExtraPersonCost());
        System.out.println("DEBUG: Child With Bed Cost: " + cost.getChildWithBedCost());
        System.out.println("DEBUG: Child Without Bed Cost: " + cost.getChildWithoutBedCost());
        System.out.println("DEBUG: ================================================");

        int totalPassengers = dto.getPassengers().size();

        // ---------------- CLASSIFY PASSENGERS BY TYPE ----------------
        LocalDate departureDate = departure.getDepartureDate();
        int adultCount = 0;
        int childCount = 0;
        int infantCount = 0;

        // First pass: classify passengers and count by type
        for (PassengerDTO p : dto.getPassengers()) {
            String passengerType = determinePassengerType(p, departureDate);
            if ("ADULT".equals(passengerType)) {
                adultCount++;
            } else if (passengerType.startsWith("CHILD")) {
                childCount++;
            } else if ("INFANT".equals(passengerType)) {
                infantCount++;
            }
        }

        System.out.println("DEBUG: Passenger breakdown - Adults: " + adultCount
                + ", Children: " + childCount + ", Infants: " + infantCount);

        // ---------------- CALCULATE PRICING ----------------
        // Adults and children (with bed) count for room allocation
        // Children without bed and infants do not occupy rooms
        int roomOccupants = adultCount;

        // Calculate child costs separately
        BigDecimal childWithBedTotal = BigDecimal.ZERO;
        BigDecimal childWithoutBedTotal = BigDecimal.ZERO;
        int childWithBedCount = 0;
        int childWithoutBedCount = 0;

        for (PassengerDTO p : dto.getPassengers()) {
            String passengerType = determinePassengerType(p, departureDate);
            if ("CHILD_WITH_BED".equals(passengerType)) {
                roomOccupants++; // Occupies room space
                childWithBedCount++;
            } else if ("CHILD_WITHOUT_BED".equals(passengerType)) {
                childWithoutBedCount++;
            }
        }

        childWithBedTotal = cost.getChildWithBedCost().multiply(new BigDecimal(childWithBedCount));
        childWithoutBedTotal = cost.getChildWithoutBedCost().multiply(new BigDecimal(childWithoutBedCount));

        System.out.println("DEBUG: Room occupants (adults + children with bed): " + roomOccupants);
        System.out.println("DEBUG: Child with bed cost: " + childWithBedTotal);
        System.out.println("DEBUG: Child without bed cost: " + childWithoutBedTotal);

        // Calculate room amount for adults only (children with bed already calculated
        // separately)
        String roomPreference = dto.getRoomPreference();
        if (roomPreference == null || roomPreference.isEmpty()) {
            roomPreference = "AUTO";
        }

        BigDecimal adultRoomAmount = calculateRoomAmount(adultCount, roomPreference, cost);

        System.out.println("DEBUG: Adult room amount: " + adultRoomAmount);

        // Total tour amount = adult room cost + child with bed + child without bed
        // Infants are FREE
        BigDecimal tourAmount = adultRoomAmount.add(childWithBedTotal).add(childWithoutBedTotal);

        System.out.println("DEBUG: Total tour amount: " + tourAmount);

        BigDecimal taxAmount = tourAmount.multiply(new BigDecimal("0.05"));

        BigDecimal totalAmount = tourAmount.add(taxAmount);

        // ---------------- SAVE BOOKING HEADER ----------------

        BookingHeader booking = new BookingHeader();

        booking.setBookingDate(LocalDate.now());
        booking.setCustomer(customer);
        booking.setTour(tour);
        booking.setDepartureDate(departure);

        booking.setTotalPassengers(totalPassengers);
        booking.setTourAmount(tourAmount);
        booking.setTaxAmount(taxAmount);
        booking.setTotalAmount(totalAmount);
        booking.setBookingStatus("PENDING");

        BookingHeader savedBooking = bookingRepo.save(booking);

        // ---------------- SAVE PASSENGERS ----------------

        if (totalPassengers <= 0) {
            throw new RuntimeException("Total passengers must be greater than zero");
        }

        for (PassengerDTO p : dto.getPassengers()) {

            PassengerMaster passenger = new PassengerMaster();

            passenger.setBooking(savedBooking);
            passenger.setPassengerName(p.getPassengerName());
            passenger.setDateOfBirth(p.getDateOfBirth());
            passenger.setGender(p.getGender());

            // Determine passenger type based on age and user selection
            String passengerType = determinePassengerType(p, departureDate);
            passenger.setPassengerType(passengerType);

            // Calculate individual passenger amount based on type
            BigDecimal passengerAmount = calculatePassengerAmount(passengerType, adultCount, cost, adultRoomAmount);
            passenger.setPassengerAmount(passengerAmount);

            System.out.println("DEBUG: Saving passenger - Name: " + p.getPassengerName()
                    + ", Type: " + passengerType + ", Amount: " + passengerAmount);

            passengerRepo.save(passenger);
        }

        return savedBooking;
    }

    // =================================================
    // PASSENGER TYPE DETERMINATION
    // =================================================

    /**
     * Determines passenger type based on age at departure date and user preference.
     * Age thresholds: Adult (18+), Child (2-17), Infant (0-2)
     */
    private String determinePassengerType(PassengerDTO passenger, LocalDate departureDate) {
        // If user explicitly selected a type, use it (for children with/without bed
        // choice)
        if (passenger.getPassengerType() != null && !passenger.getPassengerType().isEmpty()) {
            return passenger.getPassengerType();
        }

        // Calculate age as of departure date
        if (passenger.getDateOfBirth() == null) {
            return "ADULT"; // Default to adult if DOB not provided
        }

        int age = java.time.Period.between(passenger.getDateOfBirth(), departureDate).getYears();

        if (age >= 18) {
            return "ADULT";
        } else if (age >= 2) {
            return "CHILD_WITH_BED"; // Default child to with bed
        } else {
            return "INFANT";
        }
    }

    /**
     * Calculates the amount for a single passenger based on their type.
     * For adults, divides total room cost by adult count to get per-person cost.
     */
    private BigDecimal calculatePassengerAmount(String passengerType, int adultCount,
            CostMaster cost, BigDecimal totalAdultRoomAmount) {
        switch (passengerType) {
            case "ADULT":
                if (adultCount > 0) {
                    // Divide total adult room cost by number of adults to get per-person cost
                    return totalAdultRoomAmount.divide(new BigDecimal(adultCount), 2, RoundingMode.HALF_UP);
                }
                return BigDecimal.ZERO;
            case "CHILD_WITH_BED":
                return cost.getChildWithBedCost();
            case "CHILD_WITHOUT_BED":
                return cost.getChildWithoutBedCost();
            case "INFANT":
                return BigDecimal.ZERO; // Infants are free
            default:
                return BigDecimal.ZERO;
        }
    }

    // =================================================
    // ROOM ALLOCATION & PRICING LOGIC
    // =================================================

    /**
     * Calculates total room cost for adults.
     * 
     * IMPORTANT: base_cost is PER-PERSON twin sharing cost, not per-room!
     * 
     * Pricing Logic:
     * - 1 Adult: single_person_cost × 1
     * - 2 Adults (Twin): base_cost × 2
     * - 3 Adults (Triple - AUTO/preferred): (base_cost × 2) + extra_person_cost
     * - 3 Adults (Single+Twin): single_person_cost + (base_cost × 2)
     * - 4 Adults (2 Twin): base_cost × 4
     * - 5 Adults: 1 Triple + 1 Twin = (base_cost × 2 + extra) + (base_cost × 2)
     */
    private BigDecimal calculateRoomAmount(
            int adultCount,
            String preference,
            CostMaster cost) {

        if (adultCount == 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal baseCost = cost.getBaseCost(); // Per-person twin sharing
        BigDecimal singleCost = cost.getSinglePersonCost(); // Per-person single room
        BigDecimal extraCost = cost.getExtraPersonCost(); // Per-person triple (3rd person)

        // Special case: 1 adult = single room
        if (adultCount == 1) {
            return singleCost;
        }

        // Even number of adults = all twin sharing
        if (adultCount % 2 == 0) {
            // All adults in twin rooms: baseCost × number of adults
            return baseCost.multiply(new BigDecimal(adultCount));
        }

        // Odd number of adults (3, 5, 7...)
        // Three different behaviors:
        // - AUTO: prefer triple room (cheaper)
        // - ODD_SINGLE_TWIN: 1 single + rest in twin
        // - ALL_TWIN_RANDOM: all in twin sharing, odd person paired with another guest

        if (preference.equalsIgnoreCase("ALL_TWIN_RANDOM")) {
            // All adults in twin sharing, odd person paired with another guest
            // Price = baseCost × adultCount
            // Example: 3 adults = baseCost × 3 = 36000
            return baseCost.multiply(new BigDecimal(adultCount));
        }

        if (preference.equalsIgnoreCase("ODD_SINGLE_TWIN")) {
            // 1 single room + remaining in twin sharing
            // Example: 3 adults = 1 single + 2 twin
            int twinAdults = adultCount - 1;
            BigDecimal twinAmount = baseCost.multiply(new BigDecimal(twinAdults));
            return singleCost.add(twinAmount);
        }

        // AUTO: prefer triple room (cheaper)
        // Triple cost = (baseCost × 2) + extraCost for 3 people
        // Example: 3 adults = baseCost × 2 + extraCost = 24000 + 8500 = 32500
        // 5 adults = 1 triple + 1 twin = 32500 + 24000 = 56500

        int tripleRoomPeople = 3;
        int remainingAfterTriple = adultCount - tripleRoomPeople;

        // Triple room cost: 2 base-cost people + 1 extra-cost person
        BigDecimal tripleCost = baseCost.multiply(new BigDecimal(2)).add(extraCost);

        // Remaining people in twin sharing
        BigDecimal twinCost = baseCost.multiply(new BigDecimal(remainingAfterTriple));

        return tripleCost.add(twinCost);
    }

    // =================================================
    // 2️⃣ GET BOOKINGS BY CUSTOMER
    // =================================================

    @Override
    public List<BookingResponseDTO> getBookingsByCustomer(Integer customerId) {
        return bookingRepo.getBookingsByCustomerId(customerId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // =================================================
    // 3️⃣ GET BOOKING BY ID
    // =================================================

    @Override
    public BookingResponseDTO getBookingById(Integer bookingId) {
        BookingHeader booking = bookingRepo.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));
        return toDTO(booking);
    }

    // =================================================
    // 4️⃣ GET ALL BOOKINGS (ADMIN)
    // =================================================

    @Override
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepo.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // =================================================
    // 5️⃣ CANCEL BOOKING
    // =================================================

    @Override
    public void updateBookingStatus(Integer bookingId, String status) {
        BookingHeader booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        // Prevent update if already confirmed (unless admin override, but for now
        // strict)
        // Actually, allowing FAILED/CANCELLED even if confirmed might be weird,
        // but let's assume this is mostly for PENDING bookings.

        booking.setBookingStatus(status);
        bookingRepo.save(booking);
        System.out.println("DEBUG: Booking " + bookingId + " status updated to: " + status);
    }

    @Override
    public void cancelBooking(Integer bookingId) {
        // Soft cancel instead of hard delete
        updateBookingStatus(bookingId, "CANCELLED");

        // Old logic (Deleted):
        /*
         * // 1. Delete associated passengers first
         * List<PassengerMaster> passengers =
         * passengerRepo.findPassengersByBookingId(bookingId);
         * if (passengers != null && !passengers.isEmpty()) {
         * passengerRepo.deleteAll(passengers);
         * }
         * 
         * // 2. Delete the booking header
         * bookingRepo.deleteById(bookingId);
         */
    }

    private BookingResponseDTO toDTO(BookingHeader booking) {
        BookingResponseDTO dto = new BookingResponseDTO();

        // Basic booking info
        dto.setId(booking.getId());
        dto.setBookingDate(booking.getBookingDate());
        dto.setBookingStatus(booking.getBookingStatus());
        dto.setTotalPassengers(booking.getTotalPassengers());
        dto.setTourAmount(booking.getTourAmount());
        dto.setTaxAmount(booking.getTaxAmount());
        dto.setTotalAmount(booking.getTotalAmount());

        // Customer info
        if (booking.getCustomer() != null) {
            dto.setCustomerId(booking.getCustomer().getId());
            dto.setCustomerName(booking.getCustomer().getName());
            dto.setCustomerEmail(booking.getCustomer().getEmail());
            dto.setCustomerMobile(booking.getCustomer().getMobileNumber());
        }

        // Tour info
        if (booking.getTour() != null) {
            dto.setTourId(booking.getTour().getId());
            dto.setTourDescription(booking.getTour().getDescription());
            if (booking.getTour().getCatmaster() != null) {
                dto.setTourCategoryName(booking.getTour().getCatmaster().getName());
            }
        }

        // Departure date info
        if (booking.getDepartureDate() != null) {
            dto.setDepartureDateId(booking.getDepartureDate().getId());
            dto.setDepartureDate(booking.getDepartureDate().getDepartureDate());
            dto.setEndDate(booking.getDepartureDate().getEndDate());
            dto.setNumberOfDays(booking.getDepartureDate().getNumberOfDays());
        }

        return dto;
    }
}
