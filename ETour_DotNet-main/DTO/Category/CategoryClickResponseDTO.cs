using Etour_Backend_dotnet.Models;

namespace Etour_Backend_dotnet.DTO.Category;

public class CategoryClickResponseDTO
{
    public string? ResponseType { get; set; }  // "SUBCATEGORIES" | "TOUR"
    public List<CategoryDTO>? Subcategories { get; set; }
    public TourDTO? Tour { get; set; }
}

public class TourDTO
{
    public int? CatmasterId { get; set; }
    public string? TourName { get; set; }
    public string? Description { get; set; }
    public int? NumberOfDays { get; set; }
    public decimal? BaseCost { get; set; }
    public string? ImagePath { get; set; }
    public List<CostDTO>? Costs { get; set; }
    public List<DepartureDateDTO>? AvailableDates { get; set; }
    public List<ItineraryDTO>? Itinerary { get; set; }
}

public class CostDTO
{
    public decimal? BaseCost { get; set; }
    public decimal? SinglePersonCost { get; set; }
    public decimal? ExtraPersonCost { get; set; }
    public decimal? ChildWithBedCost { get; set; }
    public decimal? ChildWithoutBedCost { get; set; }
    public DateOnly? ValidFromDate { get; set; }
    public DateOnly? ValidToDate { get; set; }
}

public class DepartureDateDTO
{
    public int? Id { get; set; }
    public DateOnly? DepartureDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public int? NumberOfDays { get; set; }
}

public class ItineraryDTO
{
    public int? DayNumber { get; set; }
    public string? ItineraryDetails { get; set; }
    public string? CategoryId { get; set; }
}
