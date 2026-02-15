namespace Etour_Backend_dotnet.DTO.Departure;

/// <summary>
/// Matches Java DepartureDateDTO exactly for frontend compatibility
/// </summary>
public class DepartureDateDTO
{
    public int? Id { get; set; }
    public DateOnly? DepartureDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public int? NumberOfDays { get; set; }
}
