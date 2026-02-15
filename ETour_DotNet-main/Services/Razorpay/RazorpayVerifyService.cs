using System.Security.Cryptography;
using System.Text;
using Etour_Backend_dotnet.DTO.Razorpay;

namespace Etour_Backend_dotnet.Services.Razorpay;

public class RazorpayVerifyService : IRazorpayVerifyService
{
    private readonly IConfiguration _configuration;
    private readonly string _keySecret;

    public RazorpayVerifyService(IConfiguration configuration)
    {
        _configuration = configuration;
        _keySecret = _configuration["Razorpay:KeySecret"] ?? throw new Exception("Razorpay KeySecret not configured");
    }

    /// <summary>
    /// Verifies Razorpay payment signature using HMAC-SHA256.
    /// The signature is generated from: razorpay_order_id + "|" + razorpay_payment_id
    /// </summary>
    public bool VerifyPayment(RazorpayVerifyDTO dto)
    {
        try
        {
            // Construct payload: order_id|payment_id
            string payload = $"{dto.RazorpayOrderId}|{dto.RazorpayPaymentId}";

            // Generate expected signature using HMAC-SHA256
            string expectedSignature = GenerateHmacSha256(payload, _keySecret);

            // Compare signatures
            bool isValid = string.Equals(expectedSignature, dto.RazorpaySignature, StringComparison.OrdinalIgnoreCase);

            Console.WriteLine($"DEBUG: Payment verification - OrderId: {dto.RazorpayOrderId}, Valid: {isValid}");

            return isValid;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR: Payment verification failed - {ex.Message}");
            return false;
        }
    }

    private static string GenerateHmacSha256(string data, string secret)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        byte[] hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
        return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
    }
}
