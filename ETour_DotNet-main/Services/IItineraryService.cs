using Etour_Backend_dotnet.DTO.Itinerary;
using Etour_Backend_dotnet.Models;

namespace Etour_Backend_dotnet.Services;

public interface IItineraryService
{
    Task<List<itinerary_master>> GetAllItineraries();
    Task<itinerary_master> GetItineraryById(int id);
    Task<List<ItineraryResponseDTO>> GetItinerariesByCatmasterId(int catmasterId);
    Task<itinerary_master> SaveItinerary(itinerary_master itinerary);
    Task DeleteItinerary(int id);
}
