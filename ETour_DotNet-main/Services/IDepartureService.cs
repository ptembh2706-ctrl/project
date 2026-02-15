using Etour_Backend_dotnet.DTO.Departure;
using Etour_Backend_dotnet.Models;

namespace Etour_Backend_dotnet.Services;

public interface IDepartureService
{
    Task<departure_date_master> AddDepartureDate(departure_date_master departure);
    Task<departure_date_master> UpdateDeparture(departure_date_master departure);
    Task<List<departure_date_master>> GetAllDepartures();
    Task<departure_date_master> GetDepartureById(int id);
    Task DeleteDepartureDate(int id);
    Task<List<DepartureDateDTO>> GetDepartureDatesByCatmasterId(int catmasterId);
    Task<List<departure_date_master>> GetUpcomingDepartures();
    Task<List<departure_date_master>> GetDeparturesBetween(DateOnly start, DateOnly end);
}
