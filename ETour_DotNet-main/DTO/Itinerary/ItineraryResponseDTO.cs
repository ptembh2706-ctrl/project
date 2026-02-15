namespace Etour_Backend_dotnet.DTO.Itinerary;

/// <summary>
/// Matches Java ItineraryResponseDTO exactly for frontend compatibility
/// </summary>
public class ItineraryResponseDTO
{
    public int? DayNumber { get; set; }
    public string? ItineraryDetails { get; set; }
    public string? CategoryId { get; set; }
}
