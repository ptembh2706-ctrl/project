namespace Etour_Backend_dotnet.DTO.Invoice;

public class InvoiceResponseDTO
{
    public string InvoiceNumber { get; set; } = null!;
    public DateTime GeneratedDate { get; set; }
    
    public InvoiceCustomerDTO Customer { get; set; } = null!;
    public InvoiceBookingDTO Booking { get; set; } = null!;
    public InvoiceTourDTO Tour { get; set; } = null!;
    public InvoiceDepartureDTO Departure { get; set; } = null!;
    public List<InvoicePassengerDTO> Passengers { get; set; } = new();
    public InvoicePaymentDTO Payment { get; set; } = null!;
    public InvoiceAmountDTO Amount { get; set; } = null!;
}
