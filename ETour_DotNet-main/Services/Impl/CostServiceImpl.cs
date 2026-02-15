using Etour_Backend_dotnet.DTO.Cost;
using Etour_Backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace Etour_Backend_dotnet.Services.Impl;

public class CostServiceImpl : ICostService
{
    private readonly etour_dbContext _context;

    public CostServiceImpl(etour_dbContext context)
    {
        _context = context;
    }

    // ==========================
    // GET ALL COSTS
    // ==========================
    public async Task<List<cost_master>> GetAllCosts()
    {
        return await _context.cost_master
            .Include(c => c.catmaster)
            .ToListAsync();
    }

    // ==========================
    // GET COST BY ID
    // ==========================
    public async Task<cost_master?> GetCostById(int id)
    {
        return await _context.cost_master
            .Include(c => c.catmaster)
            .FirstOrDefaultAsync(c => c.cost_id == id);
    }

    // ==========================
    // SAVE COST (Create/Update)
    // ==========================
    public async Task<cost_master> SaveCost(cost_master cost)
    {
        if (cost.cost_id > 0)
        {
            // Update existing
            var existing = await _context.cost_master.FirstOrDefaultAsync(c => c.cost_id == cost.cost_id);
            if (existing != null)
            {
                existing.catmaster_id = cost.catmaster_id;
                existing.base_cost = cost.base_cost;
                existing.single_person_cost = cost.single_person_cost;
                existing.extra_person_cost = cost.extra_person_cost;
                existing.child_with_bed_cost = cost.child_with_bed_cost;
                existing.child_without_bed_cost = cost.child_without_bed_cost;
                existing.valid_from_date = cost.valid_from_date;
                existing.valid_to_date = cost.valid_to_date;
                await _context.SaveChangesAsync();
                return existing;
            }
        }

        // Create new
        _context.cost_master.Add(cost);
        await _context.SaveChangesAsync();
        return cost;
    }

    // ==========================
    // DELETE COST
    // ==========================
    public async Task DeleteCost(int id)
    {
        var cost = await _context.cost_master.FirstOrDefaultAsync(c => c.cost_id == id)
            ?? throw new Exception($"Cost not found with ID: {id}");

        _context.cost_master.Remove(cost);
        await _context.SaveChangesAsync();
    }

    // ==========================
    // GET COSTS BY CATEGORY
    // ==========================
    public async Task<List<CostDTO>> GetCostsByCatmasterId(int catmasterId)
    {
        return await _context.cost_master
            .Include(c => c.catmaster)
            .Where(c => c.catmaster_id == catmasterId)
            .Select(c => new CostDTO
            {
                CostId = c.cost_id,
                CatmasterId = c.catmaster_id,
                BaseCost = c.base_cost,
                SinglePersonCost = c.single_person_cost,
                ExtraPersonCost = c.extra_person_cost,
                ChildWithBedCost = c.child_with_bed_cost,
                ChildWithoutBedCost = c.child_without_bed_cost,
                ValidFromDate = c.valid_from_date,
                ValidToDate = c.valid_to_date,
                CategoryName = c.catmaster != null ? c.catmaster.name : null
            })
            .ToListAsync();
    }
}
