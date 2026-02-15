namespace Etour_Backend_dotnet.DTO.Invoice;

public class InvoiceBookingDTO
{
    public int BookingId { get; set; }
    public DateOnly BookingDate { get; set; }
    public string BookingStatus { get; set; } = null!;
    public int TotalPassengers { get; set; }
}
