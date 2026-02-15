namespace Etour_Backend_dotnet.DTO.Booking;

public class BookingRequestDTO
{
    public int CustomerId { get; set; }
    public int TourId { get; set; }
    public int DepartureDateId { get; set; }
    public string RoomPreference { get; set; } = "AUTO"; // AUTO, ODD_SINGLE_TWIN, ALL_TWIN_RANDOM
    public List<PassengerDTO> Passengers { get; set; } = new();
}
