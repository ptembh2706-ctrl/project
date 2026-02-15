namespace Etour_Backend_dotnet.DTO.Admin;

public class DashboardStatsDTO
{
    public int TotalCategories { get; set; }
    public int TotalTours { get; set; }
    public int TotalCustomers { get; set; }
    public int TotalBookings { get; set; }
    public decimal TotalRevenue { get; set; }
    public int PendingBookings { get; set; }
    public int ConfirmedBookings { get; set; }
    public int UpcomingDepartures { get; set; }
}
