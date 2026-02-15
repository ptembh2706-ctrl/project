using Microsoft.AspNetCore.Mvc;
using Etour_Backend_dotnet.Models;
using Etour_Backend_dotnet.Services;

namespace Etour_Backend_dotnet.Controllers;

[ApiController]
[Route("api/itineraries")]
public class ItineraryController : ControllerBase
{
    private readonly IItineraryService _itineraryService;

    public ItineraryController(IItineraryService itineraryService)
    {
        _itineraryService = itineraryService;
    }

    // ==========================
    // GET ALL ITINERARIES
    // ==========================
    [HttpGet]
    public async Task<IActionResult> GetAllItineraries()
    {
        var itineraries = await _itineraryService.GetAllItineraries();
        return Ok(itineraries);
    }

    // ==========================
    // GET ITINERARY BY ID
    // ==========================
    [HttpGet("{id}")]
    public async Task<IActionResult> GetItineraryById(int id)
    {
        try
        {
            var itinerary = await _itineraryService.GetItineraryById(id);
            return Ok(itinerary);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ==========================
    // GET BY CATEGORY
    // ==========================
    [HttpGet("category/{catmasterId}")]
    public async Task<IActionResult> GetItinerariesByCatmasterId(int catmasterId)
    {
        var itineraries = await _itineraryService.GetItinerariesByCatmasterId(catmasterId);
        return Ok(itineraries);
    }

    // ==========================
    // CREATE ITINERARY
    // ==========================
    [HttpPost]
    public async Task<IActionResult> CreateItinerary([FromBody] itinerary_master itinerary)
    {
        var result = await _itineraryService.SaveItinerary(itinerary);
        return Ok(result);
    }

    // ==========================
    // UPDATE ITINERARY
    // ==========================
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateItinerary(int id, [FromBody] itinerary_master itinerary)
    {
        itinerary.itinerary_id = id;
        var result = await _itineraryService.SaveItinerary(itinerary);
        return Ok(result);
    }

    // ==========================
    // DELETE ITINERARY
    // ==========================
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteItinerary(int id)
    {
        try
        {
            await _itineraryService.DeleteItinerary(id);
            return Ok(new { message = "Itinerary deleted successfully" });
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
