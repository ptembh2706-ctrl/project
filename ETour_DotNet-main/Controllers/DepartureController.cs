using Microsoft.AspNetCore.Mvc;
using Etour_Backend_dotnet.Models;
using Etour_Backend_dotnet.Services;

namespace Etour_Backend_dotnet.Controllers;

[ApiController]
[Route("api/departures")]
public class DepartureController : ControllerBase
{
    private readonly IDepartureService _departureService;

    public DepartureController(IDepartureService departureService)
    {
        _departureService = departureService;
    }

    // ==========================
    // 1. ADD DEPARTURE DATE
    // ==========================
    [HttpPost("add")]
    public async Task<IActionResult> AddDepartureDate([FromBody] departure_date_master departure)
    {
        var result = await _departureService.AddDepartureDate(departure);
        return Ok(result);
    }

    // ==========================
    // 2. UPDATE DEPARTURE
    // ==========================
    [HttpPut("update")]
    public async Task<IActionResult> UpdateDeparture([FromBody] departure_date_master departure)
    {
        try
        {
            var result = await _departureService.UpdateDeparture(departure);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ==========================
    // 3. GET ALL DEPARTURES
    // ==========================
    [HttpGet]
    public async Task<IActionResult> GetAllDepartures()
    {
        var departures = await _departureService.GetAllDepartures();
        return Ok(departures);
    }

    // ==========================
    // 4. GET DEPARTURE BY ID
    // ==========================
    [HttpGet("{id}")]
    public async Task<IActionResult> GetDepartureById(int id)
    {
        try
        {
            var departure = await _departureService.GetDepartureById(id);
            return Ok(departure);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ==========================
    // 5. DELETE DEPARTURE
    // ==========================
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteDepartureDate(int id)
    {
        try
        {
            await _departureService.DeleteDepartureDate(id);
            return Ok(new { message = "Departure date deleted successfully!" });
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ==========================
    // 6. GET BY CATEGORY
    // ==========================
    [HttpGet("category/{catmasterId}")]
    public async Task<IActionResult> GetDepartureDatesByCatmasterId(int catmasterId)
    {
        var departures = await _departureService.GetDepartureDatesByCatmasterId(catmasterId);
        return Ok(departures);
    }

    // ==========================
    // 7. GET UPCOMING DEPARTURES
    // ==========================
    [HttpGet("upcoming")]
    public async Task<IActionResult> GetUpcomingDepartures()
    {
        var departures = await _departureService.GetUpcomingDepartures();
        return Ok(departures);
    }

    // ==========================
    // 8. GET BETWEEN DATES
    // ==========================
    [HttpGet("between")]
    public async Task<IActionResult> GetDeparturesBetween(
        [FromQuery] DateOnly start,
        [FromQuery] DateOnly end)
    {
        var departures = await _departureService.GetDeparturesBetween(start, end);
        return Ok(departures);
    }
}
