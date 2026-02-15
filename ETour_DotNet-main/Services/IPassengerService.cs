using Etour_Backend_dotnet.DTO.Booking;
using Etour_Backend_dotnet.Models;

namespace Etour_Backend_dotnet.Services;

public interface IPassengerService
{
    Task<List<PassengerResponseDTO>> GetAllPassengers();
    Task<passenger_master> AddPassenger(passenger_master passenger);
    Task<List<PassengerResponseDTO>> GetPassengersByBookingId(int bookingId);
    Task<passenger_master> GetPassengerById(int passengerId);
    Task DeletePassenger(int passengerId);
}
