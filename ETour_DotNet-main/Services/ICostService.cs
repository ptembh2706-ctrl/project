using Etour_Backend_dotnet.DTO.Cost;
using Etour_Backend_dotnet.Models;

namespace Etour_Backend_dotnet.Services;

public interface ICostService
{
    Task<List<cost_master>> GetAllCosts();
    Task<cost_master?> GetCostById(int id);
    Task<cost_master> SaveCost(cost_master cost);
    Task DeleteCost(int id);
    Task<List<CostDTO>> GetCostsByCatmasterId(int catmasterId);
}
