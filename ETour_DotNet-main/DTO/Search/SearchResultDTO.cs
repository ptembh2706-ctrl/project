namespace Etour_Backend_dotnet.DTO.Search;

public class SearchResultDTO
{
    public int TourId { get; set; }
    public string? CategoryName { get; set; }
    public string? Description { get; set; }
    public string? ImagePath { get; set; }
    public DateOnly? DepartureDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public int? NumberOfDays { get; set; }
    public decimal? BaseCost { get; set; }
}
