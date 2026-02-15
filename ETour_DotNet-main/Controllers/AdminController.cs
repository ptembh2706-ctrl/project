using Microsoft.AspNetCore.Mvc;
using Etour_Backend_dotnet.DTO.Admin;
using Etour_Backend_dotnet.Models;

namespace Etour_Backend_dotnet.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly etour_dbContext _context;

    public AdminController(etour_dbContext context)
    {
        _context = context;
    }

    // ==========================
    // GET DASHBOARD STATS
    // ==========================
    [HttpGet("stats")]
    public IActionResult GetDashboardStats()
    {
        var today = DateOnly.FromDateTime(DateTime.Today);

        var stats = new DashboardStatsDTO
        {
            TotalCategories = _context.category_master.Count(),
            TotalTours = _context.tour_master.Count(),
            TotalCustomers = _context.customer_master.Count(),
            TotalBookings = _context.booking_header.Count(),
            TotalRevenue = _context.booking_header
                .Where(b => b.booking_status == "CONFIRMED")
                .Sum(b => b.total_amount),
            PendingBookings = _context.booking_header
                .Count(b => b.booking_status == "PENDING"),
            ConfirmedBookings = _context.booking_header
                .Count(b => b.booking_status == "CONFIRMED"),
            UpcomingDepartures = _context.departure_date_master
                .Count(d => d.departure_date >= today)
        };

        return Ok(stats);
    }
}
