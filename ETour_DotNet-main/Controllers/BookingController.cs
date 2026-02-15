using Microsoft.AspNetCore.Mvc;
using Etour_Backend_dotnet.DTO.Booking;
using Etour_Backend_dotnet.Services;

namespace Etour_Backend_dotnet.Controllers;

[ApiController]
[Route("api/bookings")]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    // ==========================
    // CREATE BOOKING
    // ==========================
    [HttpPost("create")]
    public async Task<IActionResult> CreateBooking([FromBody] BookingRequestDTO dto)
    {
        try
        {
            // Security: Override CustomerId from Token if available
            var customerIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
            if (!string.IsNullOrEmpty(customerIdClaim))
            {
                dto.CustomerId = int.Parse(customerIdClaim);
                Console.WriteLine($"DEBUG: Security - Forced CustomerId to {dto.CustomerId} from Token");
            }

            var booking = await _bookingService.CreateBooking(dto);
            return Ok(booking);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ==========================
    // GET BOOKINGS BY CUSTOMER
    // ==========================
    [HttpGet("customer/{customerId}")]
    public async Task<IActionResult> GetCustomerBookings(int customerId)
    {
        try
        {
            var bookings = await _bookingService.GetBookingsByCustomer(customerId);
            return Ok(bookings);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ==========================
    // GET BOOKING BY ID
    // ==========================
    [HttpGet("{bookingId}")]
    public async Task<IActionResult> GetBooking(int bookingId)
    {
        try
        {
            var booking = await _bookingService.GetBookingById(bookingId);
            return Ok(booking);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ==========================
    // GET ALL BOOKINGS (ADMIN)
    // ==========================
    [HttpGet]
    public async Task<IActionResult> GetAllBookings()
    {
        var bookings = await _bookingService.GetAllBookings();
        return Ok(bookings);
    }

    // ==========================
    // CANCEL BOOKING
    // ==========================
    [HttpDelete("{bookingId}")]
    public async Task<IActionResult> CancelBooking(int bookingId)
    {
        try
        {
            await _bookingService.CancelBooking(bookingId);
            return Ok(new { message = "Booking Cancelled Successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ==========================
    // UPDATE BOOKING STATUS
    // ==========================
    [HttpPut("{bookingId}/status")]
    public async Task<IActionResult> UpdateBookingStatus(int bookingId, [FromQuery] string status)
    {
        try
        {
            await _bookingService.UpdateBookingStatus(bookingId, status);
            return Ok(new { message = $"Booking Status Updated to {status}" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
