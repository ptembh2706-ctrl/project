using Etour_Backend_dotnet.DTO.Booking;
using Etour_Backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace Etour_Backend_dotnet.Services.Impl;

public class BookingService : IBookingService
{
    private readonly etour_dbContext _context;

    public BookingService(etour_dbContext context)
    {
        _context = context;
    }

    // =================================================
    // 1️⃣ CREATE BOOKING
    // =================================================
    public async Task<BookingResponseDTO> CreateBooking(BookingRequestDTO dto)
    {
        Console.WriteLine("DEBUG: Processing Booking Request");
        Console.WriteLine($"DEBUG: Customer ID: {dto.CustomerId}");
        Console.WriteLine($"DEBUG: Tour ID: {dto.TourId}");
        Console.WriteLine($"DEBUG: DepartureDate ID: {dto.DepartureDateId}");
        Console.WriteLine($"DEBUG: Room Preference: {dto.RoomPreference}");
        Console.WriteLine($"DEBUG: Passenger Count: {dto.Passengers?.Count ?? 0}");

        // ---------------- FETCH MASTER DATA ----------------
        var customer = await _context.customer_master.FirstOrDefaultAsync(c => c.customer_id == dto.CustomerId)
            ?? throw new Exception($"Customer not found with ID: {dto.CustomerId}");

        var departure = await _context.departure_date_master
            .Include(d => d.catmaster)
            .FirstOrDefaultAsync(d => d.departure_date_id == dto.DepartureDateId)
            ?? throw new Exception($"Departure Date not found with ID: {dto.DepartureDateId}");

        // Get category from departure date (reliable)
        var category = departure.catmaster;
        Console.WriteLine($"DEBUG: Category from departure date: {category.catmaster_id} - {category.name}");

        // Tour is optional
        var tour = await _context.tour_master
            .Include(t => t.catmaster)
            .FirstOrDefaultAsync(t => t.tour_id == dto.TourId);

        // 🛡️ SECURITY FIX: Validate that the requested Tour belongs to the correct Category
        if (tour != null && tour.catmaster_id != category.catmaster_id)
        {
            Console.WriteLine($"WARNING: Request TourId {dto.TourId} (Cat {tour.catmaster_id}) does not match Departure Category {category.catmaster_id}. Ignoring.");
            tour = null;
        }

        if (tour == null)
        {
            // Fallback: find any tour with this departure date AND correct category
            tour = await _context.tour_master
                .Include(t => t.catmaster)
                .FirstOrDefaultAsync(t => t.departure_date_id == dto.DepartureDateId && t.catmaster_id == category.catmaster_id);
        }

        // ---------------- FETCH COST ----------------
        var departureDate = departure.departure_date;

        var cost = await _context.cost_master
            .FirstOrDefaultAsync(c => c.catmaster_id == category.catmaster_id
                                 && c.valid_from_date <= departureDate
                                 && c.valid_to_date >= departureDate);

        if (cost == null)
        {
            Console.WriteLine($"WARNING: No valid cost found for date {departureDate} (Cat {category.catmaster_id}). Falling back to any cost record.");
            cost = await _context.cost_master.FirstOrDefaultAsync(c => c.catmaster_id == category.catmaster_id);
        }
            
        if (cost == null)
        {
            throw new Exception($"Cost not configured for Category ID: {category.catmaster_id}");
        }

        Console.WriteLine("DEBUG: ============ COST MASTER VALUES ============");
        Console.WriteLine($"DEBUG: Base Cost (per-person twin): {cost.base_cost}");
        Console.WriteLine($"DEBUG: Single Person Cost: {cost.single_person_cost}");
        Console.WriteLine($"DEBUG: Extra Person Cost (triple): {cost.extra_person_cost}");
        Console.WriteLine("DEBUG: ================================================");

        int totalPassengers = dto.Passengers.Count;

        // ---------------- CLASSIFY PASSENGERS BY TYPE ----------------
        int adultCount = 0;
        int childWithBedCount = 0;
        int childWithoutBedCount = 0;
        int infantCount = 0;

        foreach (var p in dto.Passengers)
        {
            string passengerType = DeterminePassengerType(p, departureDate);
            switch (passengerType)
            {
                case "ADULT": adultCount++; break;
                case "CHILD_WITH_BED": childWithBedCount++; break;
                case "CHILD_WITHOUT_BED": childWithoutBedCount++; break;
                case "INFANT": infantCount++; break;
            }
        }

        Console.WriteLine($"DEBUG: Adults: {adultCount}, Children with bed: {childWithBedCount}, " +
                          $"Children without bed: {childWithoutBedCount}, Infants: {infantCount}");

        // ---------------- CALCULATE PRICING ----------------
        decimal childWithBedTotal = cost.child_with_bed_cost * childWithBedCount;
        decimal childWithoutBedTotal = cost.child_without_bed_cost * childWithoutBedCount;

        string roomPreference = string.IsNullOrEmpty(dto.RoomPreference) ? "AUTO" : dto.RoomPreference;
        decimal adultRoomAmount = CalculateRoomAmount(adultCount, roomPreference, cost);

        Console.WriteLine($"DEBUG: Adult room amount: {adultRoomAmount}");

        // Total = adult room cost + child with bed + child without bed (infants FREE)
        decimal tourAmount = adultRoomAmount + childWithBedTotal + childWithoutBedTotal;
        decimal taxAmount = tourAmount * 0.05m;
        decimal totalAmount = tourAmount + taxAmount;

        Console.WriteLine($"DEBUG: Tour Amount: {tourAmount}, Tax: {taxAmount}, Total: {totalAmount}");

        // ---------------- SAVE BOOKING HEADER ----------------
        var booking = new booking_header
        {
            booking_date = DateOnly.FromDateTime(DateTime.Now),
            customer_id = customer.customer_id,
            tour_id = tour?.tour_id ?? 0,
            departure_date_id = departure.departure_date_id,
            total_passengers = totalPassengers,
            tour_amount = tourAmount,
            tax_amount = taxAmount,
            total_amount = totalAmount,
            booking_status = "PENDING"
        };

        _context.booking_header.Add(booking);
        await _context.SaveChangesAsync();

        // ---------------- SAVE PASSENGERS ----------------
        foreach (var p in dto.Passengers)
        {
            string passengerType = DeterminePassengerType(p, departureDate);
            decimal passengerAmount = CalculatePassengerAmount(passengerType, adultCount, cost, adultRoomAmount);

            var passenger = new passenger_master
            {
                booking_id = booking.booking_id,
                passenger_name = p.PassengerName,
                date_of_birth = p.DateOfBirth,
                passenger_type = passengerType,
                passenger_amount = passengerAmount
            };

            Console.WriteLine($"DEBUG: Saving passenger - {p.PassengerName}, Type: {passengerType}, Amount: {passengerAmount}");
            _context.passenger_master.Add(passenger);
        }

        await _context.SaveChangesAsync();

        return ToDTO(booking);
    }

    // =================================================
    // PASSENGER TYPE DETERMINATION
    // =================================================
    private string DeterminePassengerType(PassengerDTO passenger, DateOnly departureDate)
    {
        // If user explicitly selected a type, use it
        if (!string.IsNullOrEmpty(passenger.PassengerType))
        {
            return passenger.PassengerType;
        }

        // Calculate age as of departure date
        int age = CalculateAge(passenger.DateOfBirth, departureDate);

        if (age >= 18) return "ADULT";
        if (age >= 2) return "CHILD_WITH_BED"; // Default child to with bed
        return "INFANT";
    }

    private int CalculateAge(DateOnly birthDate, DateOnly referenceDate)
    {
        int age = referenceDate.Year - birthDate.Year;
        if (birthDate > referenceDate.AddYears(-age))
            age--;
        return age;
    }

    private decimal CalculatePassengerAmount(string passengerType, int adultCount, cost_master cost, decimal totalAdultRoomAmount)
    {
        return passengerType switch
        {
            "ADULT" when adultCount > 0 => Math.Round(totalAdultRoomAmount / adultCount, 2),
            "CHILD_WITH_BED" => cost.child_with_bed_cost,
            "CHILD_WITHOUT_BED" => cost.child_without_bed_cost,
            "INFANT" => 0,
            _ => 0
        };
    }

    // =================================================
    // ROOM ALLOCATION & PRICING LOGIC
    // =================================================
    private decimal CalculateRoomAmount(int adultCount, string preference, cost_master cost)
    {
        if (adultCount == 0) return 0;

        decimal baseCost = cost.base_cost;          // Per-person twin sharing
        decimal singleCost = cost.single_person_cost; // Per-person single room
        decimal extraCost = cost.extra_person_cost;   // Per-person triple (3rd person)

        // 1 adult = single room
        if (adultCount == 1) return singleCost;

        // Even number = all twin sharing
        if (adultCount % 2 == 0) return baseCost * adultCount;

        // Odd number handling
        if (preference.Equals("ALL_TWIN_RANDOM", StringComparison.OrdinalIgnoreCase))
        {
            return baseCost * adultCount;
        }

        if (preference.Equals("ODD_SINGLE_TWIN", StringComparison.OrdinalIgnoreCase))
        {
            int twinAdults = adultCount - 1;
            return singleCost + (baseCost * twinAdults);
        }

        // AUTO: prefer triple room (cheaper)
        int tripleRoomPeople = 3;
        int remainingAfterTriple = adultCount - tripleRoomPeople;
        decimal tripleCost = (baseCost * 2) + extraCost;
        decimal twinCost = baseCost * remainingAfterTriple;

        return tripleCost + twinCost;
    }

    // =================================================
    // 2️⃣ GET BOOKINGS BY CUSTOMER
    // =================================================
    public async Task<List<BookingResponseDTO>> GetBookingsByCustomer(int customerId)
    {
        return await _context.booking_header
            .Include(b => b.customer)
            .Include(b => b.tour).ThenInclude(t => t.catmaster)
            .Include(b => b.departure_date)
            .Where(b => b.customer_id == customerId)
            .Select(b => ToDTO(b))
            .ToListAsync();
    }

    // =================================================
    // 3️⃣ GET BOOKING BY ID
    // =================================================
    public async Task<BookingResponseDTO> GetBookingById(int bookingId)
    {
        var booking = await _context.booking_header
            .Include(b => b.customer)
            .Include(b => b.tour).ThenInclude(t => t.catmaster)
            .Include(b => b.departure_date)
            .FirstOrDefaultAsync(b => b.booking_id == bookingId)
            ?? throw new Exception($"Booking not found with ID: {bookingId}");

        return ToDTO(booking);
    }

    // =================================================
    // 4️⃣ GET ALL BOOKINGS (ADMIN)
    // =================================================
    public async Task<List<BookingResponseDTO>> GetAllBookings()
    {
        return await _context.booking_header
            .Include(b => b.customer)
            .Include(b => b.tour).ThenInclude(t => t.catmaster)
            .Include(b => b.departure_date)
            .Select(b => ToDTO(b))
            .ToListAsync();
    }

    // =================================================
    // 5️⃣ CANCEL BOOKING
    // =================================================
    public async Task CancelBooking(int bookingId)
    {
        await UpdateBookingStatus(bookingId, "CANCELLED");
    }

    // =================================================
    // 6️⃣ UPDATE BOOKING STATUS
    // =================================================
    public async Task UpdateBookingStatus(int bookingId, string status)
    {
        var booking = await _context.booking_header.FirstOrDefaultAsync(b => b.booking_id == bookingId)
            ?? throw new Exception($"Booking not found with ID: {bookingId}");

        booking.booking_status = status;
        await _context.SaveChangesAsync();

        Console.WriteLine($"DEBUG: Booking {bookingId} status updated to: {status}");
    }

    // =================================================
    // DTO MAPPER
    // =================================================
    private static BookingResponseDTO ToDTO(booking_header booking)
    {
        return new BookingResponseDTO
        {
            Id = booking.booking_id,
            BookingDate = booking.booking_date,
            BookingStatus = booking.booking_status,
            TotalPassengers = booking.total_passengers,
            TourAmount = booking.tour_amount,
            TaxAmount = booking.tax_amount,
            TotalAmount = booking.total_amount,

            // Customer Info
            CustomerId = booking.customer?.customer_id ?? 0,
            CustomerName = booking.customer?.name,
            CustomerEmail = booking.customer?.email,
            CustomerMobile = booking.customer?.mobile_number,

            // Tour Info
            TourId = booking.tour?.tour_id,
            TourDescription = booking.tour?.description,
            TourCategoryName = booking.tour?.catmaster?.name,

            // Departure Info
            DepartureDateId = booking.departure_date?.departure_date_id ?? 0,
            DepartureDate = booking.departure_date?.departure_date,
            EndDate = booking.departure_date?.end_date,
            NumberOfDays = booking.departure_date?.number_of_days
        };
    }
}
