using Microsoft.AspNetCore.Mvc;
using Etour_Backend_dotnet.Models;
using Etour_Backend_dotnet.Services;

namespace Etour_Backend_dotnet.Controllers;

[ApiController]
[Route("api/passengers")]
public class PassengerController : ControllerBase
{
    private readonly IPassengerService _passengerService;

    public PassengerController(IPassengerService passengerService)
    {
        _passengerService = passengerService;
    }

    // ==========================
    // GET ALL PASSENGERS
    // ==========================
    [HttpGet]
    public async Task<IActionResult> GetAllPassengers()
    {
        var passengers = await _passengerService.GetAllPassengers();
        return Ok(passengers);
    }

    // ==========================
    // ADD PASSENGER
    // ==========================
    [HttpPost("add")]
    public async Task<IActionResult> AddPassenger([FromBody] passenger_master passenger)
    {
        var result = await _passengerService.AddPassenger(passenger);
        return Ok(result);
    }

    // ==========================
    // GET BY BOOKING ID
    // ==========================
    [HttpGet("booking/{bookingId}")]
    public async Task<IActionResult> GetByBookingId(int bookingId)
    {
        var passengers = await _passengerService.GetPassengersByBookingId(bookingId);
        return Ok(passengers);
    }

    // ==========================
    // GET BY ID
    // ==========================
    [HttpGet("{passengerId}")]
    public async Task<IActionResult> GetPassengerById(int passengerId)
    {
        try
        {
            var passenger = await _passengerService.GetPassengerById(passengerId);
            return Ok(passenger);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ==========================
    // DELETE PASSENGER
    // ==========================
    [HttpDelete("{passengerId}")]
    public async Task<IActionResult> DeletePassenger(int passengerId)
    {
        try
        {
            await _passengerService.DeletePassenger(passengerId);
            return Ok(new { message = "Passenger deleted" });
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
