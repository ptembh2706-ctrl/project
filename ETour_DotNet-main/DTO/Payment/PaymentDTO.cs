namespace Etour_Backend_dotnet.DTO.Payment;

public class PaymentDTO
{
    public int? PaymentId { get; set; }
    public int BookingId { get; set; }
    public string TransactionId { get; set; } = null!;
    public DateTime PaymentDate { get; set; }
    public string PaymentMode { get; set; } = null!; // Razorpay, UPI, Card, etc.
    public string PaymentStatus { get; set; } = null!; // PENDING, SUCCESS, FAILED
    public decimal PaidAmount { get; set; }

    // Razorpay specific fields
    public string? RazorpayOrderId { get; set; }
    public string? RazorpayPaymentId { get; set; }
    public string? RazorpaySignature { get; set; }
}
