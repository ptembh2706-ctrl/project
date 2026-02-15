
namespace Etour_Backend_dotnet.DTO.Destination;

public class DestinationDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImagePath { get; set; } = string.Empty;
    public string BestTimeToVisit { get; set; } = string.Empty;
    public string Temperature { get; set; } = string.Empty;
    public List<string> Features { get; set; } = new();
    public List<ReviewDTO> Reviews { get; set; } = new();
}

public class ReviewDTO
{
    public string Name { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
}
