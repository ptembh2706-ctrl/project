using Etour_Backend_dotnet.DTO.Razorpay;

namespace Etour_Backend_dotnet.Services.Razorpay;

public interface IRazorpayService
{
    RazorpayOrderResponseDTO CreateOrder(RazorpayOrderRequestDTO request);
}
