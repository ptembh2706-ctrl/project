using Etour_Backend_dotnet.DTO.Category;
using Etour_Backend_dotnet.Models;

namespace Etour_Backend_dotnet.Services;

public interface ICategoryService
{
    Task<List<category_master>> GetMainCategories();
    Task<CategoryClickResponseDTO> HandleCategoryClick(string categoryId);
    Task<List<category_master>> SearchCategories(string? query, decimal? minBudget, decimal? maxBudget,
        int? minDays, int? maxDays, DateOnly? startDate, DateOnly? endDate);
    Task<List<category_master>> GetAllCategories();
    Task<category_master> SaveCategory(category_master category);
    Task DeleteCategory(string categoryId);
}
