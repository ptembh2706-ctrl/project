using Microsoft.AspNetCore.Mvc;
using Etour_Backend_dotnet.Models;
using Etour_Backend_dotnet.Services;

namespace Etour_Backend_dotnet.Controllers;

[ApiController]
[Route("api/tours")]
public class TourController : ControllerBase
{
    private readonly ITourService _tourService;

    public TourController(ITourService tourService)
    {
        _tourService = tourService;
    }

    // ==========================
    // GET ALL TOURS
    // ==========================
    [HttpGet]
    public async Task<IActionResult> GetAllTours()
    {
        var tours = await _tourService.GetAllTours();
        return Ok(tours);
    }

    // ==========================
    // GET TOUR BY ID
    // ==========================
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTourById(int id)
    {
        try
        {
            var tour = await _tourService.GetTourById(id);
            return Ok(tour);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ==========================
    // CREATE TOUR
    // ==========================
    [HttpPost]
    public async Task<IActionResult> CreateTour([FromBody] tour_master tour)
    {
        var result = await _tourService.AddTour(tour);
        return Ok(result);
    }

    // ==========================
    // UPDATE TOUR
    // ==========================
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTour(int id, [FromBody] tour_master tour)
    {
        try
        {
            var result = await _tourService.UpdateTour(id, tour);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ==========================
    // DELETE TOUR
    // ==========================
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTour(int id)
    {
        try
        {
            await _tourService.DeleteTour(id);
            return Ok(new { message = "Tour Deleted Successfully" });
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ==========================
    // GET TOUR DETAILS BY CATMASTER ID
    // ==========================
    [HttpGet("details/{catmasterId}")]
    public async Task<IActionResult> GetTourDetails(int catmasterId)
    {
        try
        {
            var result = await _tourService.GetTourDetailsByCatmasterId(catmasterId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
