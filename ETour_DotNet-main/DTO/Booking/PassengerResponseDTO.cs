namespace Etour_Backend_dotnet.DTO.Booking;

public class PassengerResponseDTO
{
    public int PassengerId { get; set; }
    public string PassengerName { get; set; } = null!;
    public DateOnly DateOfBirth { get; set; }
    public string Gender { get; set; } = null!;
    public string PassengerType { get; set; } = null!;
    public decimal PassengerAmount { get; set; }
}
