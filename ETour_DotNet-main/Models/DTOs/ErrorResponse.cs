namespace Etour_Backend_dotnet.Models.DTOs;

public class ErrorResponse
{
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Details { get; set; } // Stack trace or extra info (Dev only)
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
