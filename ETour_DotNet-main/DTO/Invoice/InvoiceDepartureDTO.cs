namespace Etour_Backend_dotnet.DTO.Invoice;

public class InvoiceDepartureDTO
{
    public int DepartureDateId { get; set; }
    public DateOnly DepartureDate { get; set; }
    public DateOnly EndDate { get; set; }
    public int NumberOfDays { get; set; }
}
