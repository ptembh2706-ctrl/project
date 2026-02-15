using Etour_Backend_dotnet.DTO.Category;
using Etour_Backend_dotnet.DTO.Search;
using Etour_Backend_dotnet.Models;

namespace Etour_Backend_dotnet.Services;

public interface ITourService
{
    Task<List<tour_master>> GetAllTours();
    Task<tour_master> GetTourById(int id);
    Task<tour_master> AddTour(tour_master tour);
    Task<tour_master> UpdateTour(int id, tour_master tour);
    Task DeleteTour(int id);
    Task<TourDTO> GetTourDetailsByCatmasterId(int catmasterId);
    
    // Search methods
    Task<List<SearchResultDTO>> SearchToursByDate(DateOnly from, DateOnly to);
    Task<List<SearchResultDTO>> SearchToursByDuration(int minDays, int maxDays);
    Task<List<SearchResultDTO>> SearchToursByCost(decimal minCost, decimal maxCost);
}
