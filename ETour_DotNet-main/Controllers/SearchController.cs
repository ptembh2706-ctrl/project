using Microsoft.AspNetCore.Mvc;
using Etour_Backend_dotnet.Services;

namespace Etour_Backend_dotnet.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController : ControllerBase
{
    private readonly ITourService _tourService;

    public SearchController(ITourService tourService)
    {
        _tourService = tourService;
    }

    // ==========================
    // SEARCH BY DATE RANGE
    // e.g., /api/search/period?from=2023-01-01&to=2023-01-31
    // ==========================
    [HttpGet("period")]
    public IActionResult SearchByPeriod(
        [FromQuery] DateOnly from,
        [FromQuery] DateOnly to)
    {
        var results = _tourService.SearchToursByDate(from, to);
        return Ok(results);
    }

    // ==========================
    // SEARCH BY DURATION
    // e.g., /api/search/duration?min=3&max=7
    // ==========================
    [HttpGet("duration")]
    public IActionResult SearchByDuration(
        [FromQuery] int min,
        [FromQuery] int max)
    {
        var results = _tourService.SearchToursByDuration(min, max);
        return Ok(results);
    }

    // ==========================
    // SEARCH BY COST
    // e.g., /api/search/cost?min=1000&max=5000
    // ==========================
    [HttpGet("cost")]
    public IActionResult SearchByCost(
        [FromQuery] decimal min,
        [FromQuery] decimal max)
    {
        var results = _tourService.SearchToursByCost(min, max);
        return Ok(results);
    }
}
