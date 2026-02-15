using Microsoft.AspNetCore.Mvc;
using Etour_Backend_dotnet.Models;
using Etour_Backend_dotnet.Services;

namespace Etour_Backend_dotnet.Controllers;

[ApiController]
[Route("api/costs")]
public class CostsController : ControllerBase
{
    private readonly ICostService _costService;

    public CostsController(ICostService costService)
    {
        _costService = costService;
    }

    // ==========================
    // GET ALL COSTS
    // ==========================
    [HttpGet]
    public async Task<IActionResult> GetAllCosts()
    {
        var costs = await _costService.GetAllCosts();
        return Ok(costs);
    }

    // ==========================
    // GET COST BY ID
    // ==========================
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCostById(int id)
    {
        var cost = await _costService.GetCostById(id);
        if (cost == null)
            return NotFound(new { message = $"Cost not found with ID: {id}" });
        return Ok(cost);
    }

    // ==========================
    // CREATE COST
    // ==========================
    [HttpPost]
    public async Task<IActionResult> CreateCost([FromBody] cost_master cost)
    {
        var result = await _costService.SaveCost(cost);
        return Ok(result);
    }

    // ==========================
    // UPDATE COST
    // ==========================
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCost(int id, [FromBody] cost_master cost)
    {
        cost.cost_id = id;
        var result = await _costService.SaveCost(cost);
        return Ok(result);
    }

    // ==========================
    // DELETE COST
    // ==========================
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCost(int id)
    {
        try
        {
            await _costService.DeleteCost(id);
            return Ok(new { message = "Cost deleted successfully" });
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ==========================
    // GET COSTS BY CATEGORY
    // ==========================
    [HttpGet("category/{catmasterId}")]
    public async Task<IActionResult> GetCostsByCategory(int catmasterId)
    {
        var costs = await _costService.GetCostsByCatmasterId(catmasterId);
        return Ok(costs);
    }
}
