using Etour_Backend_dotnet.DTO.Departure;
using Etour_Backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace Etour_Backend_dotnet.Services.Impl;

public class DepartureService : IDepartureService
{
    private readonly etour_dbContext _context;

    public DepartureService(etour_dbContext context)
    {
        _context = context;
    }

    // ==========================
    // ADD DEPARTURE DATE
    // ==========================
    public async Task<departure_date_master> AddDepartureDate(departure_date_master departure)
    {
        _context.departure_date_master.Add(departure);
        await _context.SaveChangesAsync();
        return departure;
    }

    // ==========================
    // UPDATE DEPARTURE
    // ==========================
    public async Task<departure_date_master> UpdateDeparture(departure_date_master updatedDeparture)
    {
        var departure = await _context.departure_date_master
            .FirstOrDefaultAsync(d => d.departure_date_id == updatedDeparture.departure_date_id)
            ?? throw new Exception($"Departure not found with ID: {updatedDeparture.departure_date_id}");

        departure.catmaster_id = updatedDeparture.catmaster_id;
        departure.departure_date = updatedDeparture.departure_date;
        departure.end_date = updatedDeparture.end_date;
        departure.number_of_days = updatedDeparture.number_of_days;

        await _context.SaveChangesAsync();
        return departure;
    }

    // ==========================
    // GET ALL DEPARTURES
    // ==========================
    public async Task<List<departure_date_master>> GetAllDepartures()
    {
        return await _context.departure_date_master
            .Include(d => d.catmaster)
            .ToListAsync();
    }

    // ==========================
    // GET DEPARTURE BY ID
    // ==========================
    public async Task<departure_date_master> GetDepartureById(int id)
    {
        return await _context.departure_date_master
            .Include(d => d.catmaster)
            .FirstOrDefaultAsync(d => d.departure_date_id == id)
            ?? throw new Exception($"Departure not found with ID: {id}");
    }

    // ==========================
    // DELETE DEPARTURE DATE
    // ==========================
    public async Task DeleteDepartureDate(int id)
    {
        var departure = await _context.departure_date_master.FirstOrDefaultAsync(d => d.departure_date_id == id)
            ?? throw new Exception($"Departure not found with ID: {id}");

        _context.departure_date_master.Remove(departure);
        await _context.SaveChangesAsync();
    }

    // ==========================
    // GET BY CATMASTER ID
    // ==========================
    public async Task<List<DepartureDateDTO>> GetDepartureDatesByCatmasterId(int catmasterId)
    {
        return await _context.departure_date_master
            .Include(d => d.catmaster)
            .Where(d => d.catmaster_id == catmasterId)
            .Select(d => new DepartureDateDTO
            {
                Id = d.departure_date_id,
                DepartureDate = d.departure_date,
                EndDate = d.end_date,
                NumberOfDays = d.number_of_days
            })
            .ToListAsync();
    }

    // ==========================
    // GET UPCOMING DEPARTURES
    // ==========================
    public async Task<List<departure_date_master>> GetUpcomingDepartures()
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        return await _context.departure_date_master
            .Include(d => d.catmaster)
            .Where(d => d.departure_date >= today)
            .OrderBy(d => d.departure_date)
            .ToListAsync();
    }

    // ==========================
    // GET DEPARTURES BETWEEN DATES
    // ==========================
    public async Task<List<departure_date_master>> GetDeparturesBetween(DateOnly start, DateOnly end)
    {
        return await _context.departure_date_master
            .Include(d => d.catmaster)
            .Where(d => d.departure_date >= start && d.departure_date <= end)
            .OrderBy(d => d.departure_date)
            .ToListAsync();
    }
}
