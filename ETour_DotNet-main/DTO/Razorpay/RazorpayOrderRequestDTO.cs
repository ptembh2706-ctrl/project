namespace Etour_Backend_dotnet.DTO.Razorpay;

public class RazorpayOrderRequestDTO
{
    public int BookingId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "INR";
}
