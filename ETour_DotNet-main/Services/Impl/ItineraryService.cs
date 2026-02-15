using Etour_Backend_dotnet.DTO.Itinerary;
using Etour_Backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace Etour_Backend_dotnet.Services.Impl;

public class ItineraryService : IItineraryService
{
    private readonly etour_dbContext _context;

    public ItineraryService(etour_dbContext context)
    {
        _context = context;
    }

    // ==========================
    // GET ALL ITINERARIES
    // ==========================
    public async Task<List<itinerary_master>> GetAllItineraries()
    {
        return await _context.itinerary_master
            .Include(i => i.catmaster)
            .OrderBy(i => i.catmaster_id)
            .ThenBy(i => i.day_number)
            .ToListAsync();
    }

    // ==========================
    // GET ITINERARY BY ID
    // ==========================
    public async Task<itinerary_master> GetItineraryById(int id)
    {
        return await _context.itinerary_master
            .Include(i => i.catmaster)
            .FirstOrDefaultAsync(i => i.itinerary_id == id)
            ?? throw new Exception($"Itinerary not found with ID: {id}");
    }

    // ==========================
    // GET BY CATMASTER ID
    // ==========================
    public async Task<List<ItineraryResponseDTO>> GetItinerariesByCatmasterId(int catmasterId)
    {
        return await _context.itinerary_master
            .Include(i => i.catmaster)
            .Where(i => i.catmaster_id == catmasterId)
            .OrderBy(i => i.day_number)
            .Select(i => new ItineraryResponseDTO
            {
                DayNumber = i.day_number,
                ItineraryDetails = i.itinerary_details,
                CategoryId = i.catmaster != null ? i.catmaster.category_id : null
            })
            .ToListAsync();
    }

    // ==========================
    // SAVE ITINERARY (Create/Update)
    // ==========================
    public async Task<itinerary_master> SaveItinerary(itinerary_master itinerary)
    {
        if (itinerary.itinerary_id > 0)
        {
            var existing = await _context.itinerary_master.FirstOrDefaultAsync(i => i.itinerary_id == itinerary.itinerary_id);
            if (existing != null)
            {
                existing.catmaster_id = itinerary.catmaster_id;
                existing.day_number = itinerary.day_number;
                existing.itinerary_details = itinerary.itinerary_details;
                await _context.SaveChangesAsync();
                return existing;
            }
        }

        _context.itinerary_master.Add(itinerary);
        await _context.SaveChangesAsync();
        return itinerary;
    }

    // ==========================
    // DELETE ITINERARY
    // ==========================
    public async Task DeleteItinerary(int id)
    {
        var itinerary = await _context.itinerary_master.FirstOrDefaultAsync(i => i.itinerary_id == id)
            ?? throw new Exception($"Itinerary not found with ID: {id}");

        _context.itinerary_master.Remove(itinerary);
        await _context.SaveChangesAsync();
    }
}
