namespace Etour_Backend_dotnet.DTO.Invoice;

public class InvoicePaymentDTO
{
    public int PaymentId { get; set; }
    public string TransactionId { get; set; } = null!;
    public DateTime PaymentDate { get; set; }
    public string PaymentMode { get; set; } = null!;
    public string PaymentStatus { get; set; } = null!;
    public decimal PaidAmount { get; set; }
}
