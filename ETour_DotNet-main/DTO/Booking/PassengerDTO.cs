namespace Etour_Backend_dotnet.DTO.Booking;

public class PassengerDTO
{
    public string PassengerName { get; set; } = null!;
    public DateOnly DateOfBirth { get; set; }
    public string Gender { get; set; } = null!;
    public string? PassengerType { get; set; } // ADULT, CHILD_WITH_BED, CHILD_WITHOUT_BED, INFANT
}
