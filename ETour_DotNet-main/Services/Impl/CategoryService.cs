using Etour_Backend_dotnet.DTO.Category;
using Etour_Backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace Etour_Backend_dotnet.Services.Impl;

public class CategoryService : ICategoryService
{
    private readonly etour_dbContext _context;
    private readonly ITourService _tourService;

    public CategoryService(etour_dbContext context, ITourService tourService)
    {
        _context = context;
        _tourService = tourService;
    }

    // ==========================
    // GET MAIN CATEGORIES (subcategory_id IS NULL)
    // ==========================
    public async Task<List<category_master>> GetMainCategories()
    {
        return await _context.category_master
            .Where(c => c.subcategory_id == null)
            .ToListAsync();
    }

    // ==========================
    // HANDLE CATEGORY CLICK
    // flag=true => leaf node => return TourDTO
    // flag=false => show subcategories
    // ==========================
    public async Task<CategoryClickResponseDTO> HandleCategoryClick(string categoryId)
    {
        var category = await _context.category_master
            .FirstOrDefaultAsync(c => c.category_id == categoryId)
            ?? throw new Exception("Category not found");

        var resp = new CategoryClickResponseDTO();

        // flag=true means it's a leaf node (tour)
        if (category.flag)
        {
            resp.ResponseType = "TOUR";
            resp.Subcategories = null;
            // NOTE: ITourService is now async, so we await it.
            resp.Tour = await _tourService.GetTourDetailsByCatmasterId(category.catmaster_id);
        }
        else
        {
            // Get subcategories
            var subcats = await _context.category_master
                .Where(c => c.subcategory_id == category.category_id)
                .ToListAsync();

            resp.ResponseType = "SUBCATEGORIES";
            resp.Subcategories = subcats.Select(c => new CategoryDTO
            {
                Id = c.catmaster_id,
                CategoryId = c.category_id,
                SubcategoryId = c.subcategory_id,
                Name = c.name,
                ImagePath = c.image_path,
                Flag = c.flag
            }).ToList();
            resp.Tour = null;
        }

        return resp;
    }

    // ==========================
    // SEARCH CATEGORIES
    // ==========================
    public async Task<List<category_master>> SearchCategories(string? query, decimal? minBudget, decimal? maxBudget,
        int? minDays, int? maxDays, DateOnly? startDate, DateOnly? endDate)
    {
        var categories = _context.category_master
            .Include(c => c.cost_master)
            .Include(c => c.departure_date_master)
            .AsQueryable();

        // Filter by name/query
        if (!string.IsNullOrEmpty(query))
        {
            categories = categories.Where(c => c.name != null && c.name.Contains(query));
        }

        // Filter by budget (base_cost from cost_master)
        if (minBudget.HasValue || maxBudget.HasValue)
        {
            categories = categories.Where(c => c.cost_master.Any(cm =>
                (!minBudget.HasValue || cm.base_cost >= minBudget) &&
                (!maxBudget.HasValue || cm.base_cost <= maxBudget)));
        }

        // Filter by duration (number_of_days from departure_date_master)
        if (minDays.HasValue || maxDays.HasValue)
        {
            categories = categories.Where(c => c.departure_date_master.Any(d =>
                (!minDays.HasValue || d.number_of_days >= minDays) &&
                (!maxDays.HasValue || d.number_of_days <= maxDays)));
        }

        // Filter by date range
        if (startDate.HasValue || endDate.HasValue)
        {
            categories = categories.Where(c => c.departure_date_master.Any(d =>
                (!startDate.HasValue || d.departure_date >= startDate) &&
                (!endDate.HasValue || d.departure_date <= endDate)));
        }

        return await categories.ToListAsync();
    }

    // ==========================
    // GET ALL CATEGORIES
    // ==========================
    public async Task<List<category_master>> GetAllCategories()
    {
        return await _context.category_master.ToListAsync();
    }

    // ==========================
    // SAVE CATEGORY (Create/Update)
    // ==========================
    public async Task<category_master> SaveCategory(category_master category)
    {
        var existing = await _context.category_master
            .FirstOrDefaultAsync(c => c.category_id == category.category_id);

        if (existing != null)
        {
            existing.name = category.name;
            existing.subcategory_id = category.subcategory_id;
            existing.image_path = category.image_path;
            existing.flag = category.flag;
        }
        else
        {
            _context.category_master.Add(category);
        }

        await _context.SaveChangesAsync();
        return existing ?? category;
    }

    // ==========================
    // DELETE CATEGORY
    // ==========================
    public async Task DeleteCategory(string categoryId)
    {
        var category = await _context.category_master
            .FirstOrDefaultAsync(c => c.category_id == categoryId)
            ?? throw new Exception($"Category not found with ID: {categoryId}");

        _context.category_master.Remove(category);
        await _context.SaveChangesAsync();
    }
}
