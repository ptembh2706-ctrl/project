namespace Etour_Backend_dotnet.DTO.Razorpay;

public class RazorpayOrderResponseDTO
{
    public string OrderId { get; set; } = null!;
    public long Amount { get; set; }
    public string Currency { get; set; } = null!;
    public string KeyId { get; set; } = null!;
    public int BookingId { get; set; }
}
