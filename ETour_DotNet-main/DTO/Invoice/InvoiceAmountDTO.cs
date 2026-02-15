namespace Etour_Backend_dotnet.DTO.Invoice;

public class InvoiceAmountDTO
{
    public decimal TourAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal BalanceAmount { get; set; }
}
