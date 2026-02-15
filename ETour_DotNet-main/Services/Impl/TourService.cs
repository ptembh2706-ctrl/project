using Etour_Backend_dotnet.DTO.Category;
using Etour_Backend_dotnet.DTO.Search;
using Etour_Backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace Etour_Backend_dotnet.Services.Impl;

public class TourService : ITourService
{
    private readonly etour_dbContext _context;

    public TourService(etour_dbContext context)
    {
        _context = context;
    }

    // ==========================
    // GET ALL TOURS
    // ==========================
    public async Task<List<tour_master>> GetAllTours()
    {
        return await _context.tour_master
            .Include(t => t.catmaster)
            .Include(t => t.departure_date)
            .ToListAsync();
    }

    // ==========================
    // GET TOUR BY ID
    // ==========================
    public async Task<tour_master> GetTourById(int id)
    {
        return await _context.tour_master
            .Include(t => t.catmaster)
            .Include(t => t.departure_date)
            .FirstOrDefaultAsync(t => t.tour_id == id)
            ?? throw new Exception($"Tour not found with ID: {id}");
    }

    // ==========================
    // ADD TOUR
    // ==========================
    public async Task<tour_master> AddTour(tour_master tour)
    {
        _context.tour_master.Add(tour);
        await _context.SaveChangesAsync();
        return tour;
    }

    // ==========================
    // UPDATE TOUR
    // ==========================
    public async Task<tour_master> UpdateTour(int id, tour_master updatedTour)
    {
        var tour = await _context.tour_master.FirstOrDefaultAsync(t => t.tour_id == id)
            ?? throw new Exception($"Tour not found with ID: {id}");

        tour.catmaster_id = updatedTour.catmaster_id;
        tour.departure_date_id = updatedTour.departure_date_id;
        tour.description = updatedTour.description;

        await _context.SaveChangesAsync();
        return tour;
    }

    // ==========================
    // DELETE TOUR
    // ==========================
    public async Task DeleteTour(int id)
    {
        var tour = await _context.tour_master.FirstOrDefaultAsync(t => t.tour_id == id)
            ?? throw new Exception($"Tour not found with ID: {id}");

        _context.tour_master.Remove(tour);
        await _context.SaveChangesAsync();
    }

    // ==========================
    // GET TOUR DETAILS BY CATMASTER ID
    // Returns TourDTO with nested costs, dates, itinerary
    // ==========================
    public async Task<TourDTO> GetTourDetailsByCatmasterId(int catmasterId)
    {
        var category = await _context.category_master
            .Include(c => c.cost_master)
            .Include(c => c.departure_date_master)
            .Include(c => c.itinerary_master)
            .Include(c => c.tour_master)
            .FirstOrDefaultAsync(c => c.catmaster_id == catmasterId)
            ?? throw new Exception($"Category not found with ID: {catmasterId}");

        var dto = new TourDTO
        {
            CatmasterId = catmasterId,
            TourName = category.name,
            ImagePath = category.image_path
        };

        // Get description from tour_master
        var tour = category.tour_master.FirstOrDefault();
        if (tour != null)
        {
            dto.Description = tour.description;
        }

        // Map costs
        dto.Costs = category.cost_master.Select(c => new CostDTO
        {
            BaseCost = c.base_cost,
            SinglePersonCost = c.single_person_cost,
            ExtraPersonCost = c.extra_person_cost,
            ChildWithBedCost = c.child_with_bed_cost,
            ChildWithoutBedCost = c.child_without_bed_cost,
            ValidFromDate = c.valid_from_date,
            ValidToDate = c.valid_to_date
        }).ToList();

        // Set base cost from first cost
        if (dto.Costs.Any())
        {
            dto.BaseCost = dto.Costs.First().BaseCost;
        }

        // Map departure dates
        dto.AvailableDates = category.departure_date_master.Select(d => new DepartureDateDTO
        {
            Id = d.departure_date_id,
            DepartureDate = d.departure_date,
            EndDate = d.end_date,
            NumberOfDays = d.number_of_days
        }).ToList();

        // Set number of days from first date
        if (dto.AvailableDates.Any())
        {
            dto.NumberOfDays = dto.AvailableDates.First().NumberOfDays;
        }

        // Map itinerary
        dto.Itinerary = category.itinerary_master
            .OrderBy(i => i.day_number)
            .Select(i => new ItineraryDTO
            {
                DayNumber = i.day_number,
                ItineraryDetails = i.itinerary_details,
                CategoryId = category.category_id
            }).ToList();

        return dto;
    }

    // ==========================
    // SEARCH BY DATE RANGE
    // ==========================
    public async Task<List<SearchResultDTO>> SearchToursByDate(DateOnly from, DateOnly to)
    {
        var tours = await _context.tour_master
            .Include(t => t.catmaster).ThenInclude(c => c.cost_master)
            .Include(t => t.departure_date)
            .Where(t => t.departure_date != null &&
                        t.departure_date.departure_date >= from &&
                        t.departure_date.departure_date <= to)
            .ToListAsync();

        return tours.Select(t => ToSearchResult(t)).ToList();
    }

    // ==========================
    // SEARCH BY DURATION
    // ==========================
    public async Task<List<SearchResultDTO>> SearchToursByDuration(int minDays, int maxDays)
    {
        var tours = await _context.tour_master
            .Include(t => t.catmaster).ThenInclude(c => c.cost_master)
            .Include(t => t.departure_date)
            .Where(t => t.departure_date != null &&
                        t.departure_date.number_of_days >= minDays &&
                        t.departure_date.number_of_days <= maxDays)
            .ToListAsync();

        return tours.Select(t => ToSearchResult(t)).ToList();
    }

    // ==========================
    // SEARCH BY COST
    // ==========================
    public async Task<List<SearchResultDTO>> SearchToursByCost(decimal minCost, decimal maxCost)
    {
        var tours = await _context.tour_master
            .Include(t => t.catmaster).ThenInclude(c => c.cost_master)
            .Include(t => t.departure_date)
            .Where(t => t.catmaster != null &&
                        t.catmaster.cost_master.Any(c => c.base_cost >= minCost && c.base_cost <= maxCost))
            .ToListAsync();

        return tours.Select(t => ToSearchResult(t)).ToList();
    }

    // Helper to map to SearchResultDTO
    private static SearchResultDTO ToSearchResult(tour_master t)
    {
        var cost = t.catmaster?.cost_master.FirstOrDefault();
        return new SearchResultDTO
        {
            TourId = t.tour_id,
            CategoryName = t.catmaster?.name,
            Description = t.description,
            ImagePath = t.catmaster?.image_path,
            DepartureDate = t.departure_date?.departure_date,
            EndDate = t.departure_date?.end_date,
            NumberOfDays = t.departure_date?.number_of_days,
            BaseCost = cost?.base_cost
        };
    }
}
