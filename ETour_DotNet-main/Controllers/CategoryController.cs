using Microsoft.AspNetCore.Mvc;
using Etour_Backend_dotnet.DTO.Category;
using Etour_Backend_dotnet.Models;
using Etour_Backend_dotnet.Services;

namespace Etour_Backend_dotnet.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoryController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    // ==========================
    // GET MAIN CATEGORIES
    // ==========================
    [HttpGet]
    public async Task<IActionResult> GetMainCategories()
    {
        var categories = await _categoryService.GetMainCategories();
        var dtos = categories.Select(c => new CategoryDTO
        {
            Id = c.catmaster_id,
            CategoryId = c.category_id,
            SubcategoryId = c.subcategory_id,
            Name = c.name,
            ImagePath = c.image_path,
            Flag = c.flag
        }).ToList();
        return Ok(dtos);
    }

    // ==========================
    // HANDLE CATEGORY CLICK
    // ==========================
    [HttpGet("{categoryId}")]
    public async Task<IActionResult> HandleCategoryClick(string categoryId)
    {
        var result = await _categoryService.HandleCategoryClick(categoryId);
        return Ok(result);
    }

    // ==========================
    // SEARCH CATEGORIES
    // ==========================
    [HttpGet("search")]
    public async Task<IActionResult> SearchCategories(
        [FromQuery] string? query,
        [FromQuery] decimal? minBudget,
        [FromQuery] decimal? maxBudget,
        [FromQuery] int? minDays,
        [FromQuery] int? maxDays,
        [FromQuery] DateOnly? startDate,
        [FromQuery] DateOnly? endDate)
    {
        var categories = await _categoryService.SearchCategories(
            query, minBudget, maxBudget, minDays, maxDays, startDate, endDate);
            
        var dtos = categories.Select(c => new CategoryDTO
        {
            Id = c.catmaster_id,
            CategoryId = c.category_id,
            SubcategoryId = c.subcategory_id,
            Name = c.name,
            ImagePath = c.image_path, // Critical for image display
            Flag = c.flag
        }).ToList();

        return Ok(dtos);
    }

    // ==========================
    // GET ALL CATEGORIES
    // ==========================
    [HttpGet("all")]
    public async Task<IActionResult> GetAllCategories()
    {
        var categories = await _categoryService.GetAllCategories();
        return Ok(categories);
    }

    // ==========================
    // CREATE CATEGORY
    // ==========================
    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] category_master category)
    {
        try
        {
            var result = await _categoryService.SaveCategory(category);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ==========================
    // UPDATE CATEGORY
    // ==========================
    [HttpPut("{categoryId}")]
    public async Task<IActionResult> UpdateCategory(string categoryId, [FromBody] category_master category)
    {
        try
        {
            category.category_id = categoryId;
            var result = await _categoryService.SaveCategory(category);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ==========================
    // DELETE CATEGORY
    // ==========================
    [HttpDelete("{categoryId}")]
    public async Task<IActionResult> DeleteCategory(string categoryId)
    {
        try
        {
            await _categoryService.DeleteCategory(categoryId);
            return Ok(new { message = "Category deleted successfully" });
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
