namespace Etour_Backend_dotnet.DTO.Booking;

public class BookingResponseDTO
{
    // Booking Info
    public int Id { get; set; }
    public DateOnly BookingDate { get; set; }
    public string BookingStatus { get; set; } = null!;
    public int TotalPassengers { get; set; }

    // Amount Info
    public decimal TourAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal TotalAmount { get; set; }

    // Customer Info
    public int CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public string? CustomerEmail { get; set; }
    public string? CustomerMobile { get; set; }

    // Tour Info
    public int? TourId { get; set; }
    public string? TourDescription { get; set; }
    public string? TourCategoryName { get; set; }

    // Departure Info
    public int DepartureDateId { get; set; }
    public DateOnly? DepartureDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public int? NumberOfDays { get; set; }
}
