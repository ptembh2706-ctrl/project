using Etour_Backend_dotnet.DTO.Razorpay;
using Etour_Backend_dotnet.Models;
using Razorpay.Api;

namespace Etour_Backend_dotnet.Services.Razorpay;

public class RazorpayService : IRazorpayService
{
    private readonly IConfiguration _configuration;
    private readonly etour_dbContext _context;
    private readonly string _keyId;
    private readonly string _keySecret;

    public RazorpayService(IConfiguration configuration, etour_dbContext context)
    {
        _configuration = configuration;
        _context = context;
        _keyId = _configuration["Razorpay:KeyId"] ?? throw new Exception("Razorpay KeyId not configured");
        _keySecret = _configuration["Razorpay:KeySecret"] ?? throw new Exception("Razorpay KeySecret not configured");
    }

    public RazorpayOrderResponseDTO CreateOrder(RazorpayOrderRequestDTO request)
    {
        // 1️⃣ Validate booking exists
        var booking = _context.booking_header.FirstOrDefault(b => b.booking_id == request.BookingId)
            ?? throw new Exception($"Booking not found with ID: {request.BookingId}");

        // 2️⃣ Validate booking status - only PENDING or FAILED can be paid
        var status = booking.booking_status?.ToUpperInvariant();
        if (status != "PENDING" && status != "FAILED")
        {
            throw new Exception($"Only PENDING or FAILED bookings can be paid. Current status: {booking.booking_status}");
        }

        // 3️⃣ Validate total amount is set
        if (booking.total_amount <= 0)
        {
            throw new Exception($"Booking amount must be positive. Current: {booking.total_amount}");
        }

        try
        {
            var client = new RazorpayClient(_keyId, _keySecret);

            // 4️⃣ CRITICAL: Amount MUST come from database, NOT from request!
            long amountInPaise = (long)(booking.total_amount * 100);

            // Validate minimum amount (₹1 = 100 paise)
            if (amountInPaise < 100)
            {
                throw new Exception($"Booking amount must be at least ₹1.00. Current: {booking.total_amount}");
            }

            var options = new Dictionary<string, object>
            {
                { "amount", amountInPaise },
                { "currency", "INR" },
                { "receipt", $"booking_{request.BookingId}" },
                { "notes", new Dictionary<string, string>
                    {
                        { "booking_id", request.BookingId.ToString() }
                    }
                }
            };

            Order order = client.Order.Create(options);

            Console.WriteLine($"DEBUG: Razorpay order created - ID: {order["id"]}, Amount: {amountInPaise} paise (₹{booking.total_amount})");

            return new RazorpayOrderResponseDTO
            {
                OrderId = order["id"].ToString(),
                Amount = amountInPaise,
                Currency = "INR",
                KeyId = _keyId,
                BookingId = request.BookingId
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR: Failed to create Razorpay order - {ex.Message}");
            throw new Exception($"Failed to create Razorpay order: {ex.Message}");
        }
    }
}
