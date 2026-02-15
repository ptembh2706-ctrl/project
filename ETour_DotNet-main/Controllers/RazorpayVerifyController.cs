using Microsoft.AspNetCore.Mvc;
using Etour_Backend_dotnet.DTO.Razorpay;
using Etour_Backend_dotnet.DTO.Payment;
using Etour_Backend_dotnet.Services;
using Etour_Backend_dotnet.Services.Razorpay;

namespace Etour_Backend_dotnet.Controllers;

[ApiController]
[Route("api/razorpay")]
public class RazorpayVerifyController : ControllerBase
{
    private readonly IRazorpayVerifyService _verifyService;
    private readonly IPaymentService _paymentService;
    private readonly IBookingService _bookingService;

    public RazorpayVerifyController(
        IRazorpayVerifyService verifyService,
        IPaymentService paymentService,
        IBookingService bookingService)
    {
        _verifyService = verifyService;
        _paymentService = paymentService;
        _bookingService = bookingService;
    }

    /// <summary>
    /// Verify Razorpay payment signature and update booking/payment status
    /// </summary>
    [HttpPost("verify-payment")]
    public async Task<IActionResult> VerifyPayment([FromBody] RazorpayVerifyDTO dto)
    {
        try
        {
            bool isValid = _verifyService.VerifyPayment(dto);

            if (!isValid)
            {
                // Payment verification failed - update booking status to FAILED
                await _bookingService.UpdateBookingStatus(dto.BookingId, "FAILED");

                return BadRequest(new
                {
                    success = false,
                    message = "Payment verification failed. Signature mismatch."
                });
            }

            // Payment verified - create payment record
            // PaymentService.AddPayment will:
            // 1. Validate booking exists and status
            // 2. Prevent duplicate transactions
            // 3. Update booking to CONFIRMED on SUCCESS
            // 4. Send invoice email
            var paymentDto = new PaymentDTO
            {
                BookingId = dto.BookingId,
                TransactionId = dto.RazorpayPaymentId,
                PaymentDate = DateTime.Now,
                PaymentMode = "RAZORPAY",
                PaymentStatus = "SUCCESS",
                PaidAmount = 0, // Will be set from booking
                RazorpayOrderId = dto.RazorpayOrderId,
                RazorpayPaymentId = dto.RazorpayPaymentId,
                RazorpaySignature = dto.RazorpaySignature
            };

            // Get booking to fetch amount
            var booking = await _bookingService.GetBookingById(dto.BookingId);
            paymentDto.PaidAmount = booking.TotalAmount;

            // Save payment - this also confirms booking and sends email
            var savedPayment = await _paymentService.AddPayment(paymentDto);

            Console.WriteLine($"DEBUG: Payment verified and processed for Booking {dto.BookingId}");

            return Ok(new
            {
                success = true,
                message = "Payment verified and booking confirmed!",
                bookingId = dto.BookingId,
                paymentId = savedPayment.PaymentId
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR: Payment verification exception - {ex.Message}");
            return BadRequest(new
            {
                success = false,
                message = ex.Message
            });
        }
    }
}
