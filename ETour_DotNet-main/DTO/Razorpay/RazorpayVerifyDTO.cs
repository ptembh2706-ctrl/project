namespace Etour_Backend_dotnet.DTO.Razorpay;

public class RazorpayVerifyDTO
{
    public string RazorpayOrderId { get; set; } = null!;
    public string RazorpayPaymentId { get; set; } = null!;
    public string RazorpaySignature { get; set; } = null!;
    public int BookingId { get; set; }
}
