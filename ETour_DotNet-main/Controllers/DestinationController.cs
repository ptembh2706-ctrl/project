using Microsoft.AspNetCore.Mvc;
using Etour_Backend_dotnet.DTO.Destination;
using Etour_Backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace Etour_Backend_dotnet.Controllers;

[ApiController]
[Route("api/destinations")]
public class DestinationController : ControllerBase
{
    private readonly etour_dbContext _context;

    public DestinationController(etour_dbContext context)
    {
        _context = context;
    }

    // ==========================
    // GET ALL DESTINATIONS
    // (Maps Categories to DestinationDTO with placeholder data)
    // ==========================
    [HttpGet]
    public IActionResult GetAllDestinations()
    {
        var categories = _context.category_master
            .Where(c => c.subcategory_id == null) // Main categories only
            .ToList();

        var destinations = categories.Select(c => ConvertToDTO(c)).ToList();
        return Ok(destinations);
    }

    private DestinationDTO ConvertToDTO(category_master category)
    {
        var dto = new DestinationDTO
        {
            Id = category.catmaster_id,
            Name = category.name ?? "Unknown",
            ImagePath = category.image_path ?? "",
            
            // Hardcoded/Placeholder logic to match Legacy Java Backend
            BestTimeToVisit = "Oct - Mar",
            Temperature = "20°C - 30°C",
            Features = new List<string> { "Cultural Sites", "Hotels", "Transport" },
            Reviews = new List<ReviewDTO>
            {
                new ReviewDTO { Name = "Happy Traveler", Rating = 5, Comment = $"Amazing experience visiting {category.name}!" },
                new ReviewDTO { Name = "Tour Guide", Rating = 4, Comment = "Great infrastructure and views." }
            }
        };
        return dto;
    }
}
