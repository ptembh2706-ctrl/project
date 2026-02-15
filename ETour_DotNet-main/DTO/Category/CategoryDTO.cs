namespace Etour_Backend_dotnet.DTO.Category;

public class CategoryDTO
{
    public int Id { get; set; }
    public string? CategoryId { get; set; }
    public string? SubcategoryId { get; set; }
    public string? Name { get; set; }
    public string? ImagePath { get; set; }
    public bool? Flag { get; set; }
}
