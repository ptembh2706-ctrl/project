namespace Etour_Backend_dotnet.DTO.Cost;

public class CostDTO
{
    public int? CostId { get; set; }
    public int? CatmasterId { get; set; }
    public decimal? BaseCost { get; set; }
    public decimal? SinglePersonCost { get; set; }
    public decimal? ExtraPersonCost { get; set; }
    public decimal? ChildWithBedCost { get; set; }
    public decimal? ChildWithoutBedCost { get; set; }
    public DateOnly? ValidFromDate { get; set; }
    public DateOnly? ValidToDate { get; set; }
    public string? CategoryName { get; set; }
}
