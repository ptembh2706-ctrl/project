using Etour_Backend_dotnet.DTO.Booking;
using Etour_Backend_dotnet.Models;

namespace Etour_Backend_dotnet.Services;

public interface IBookingService
{
    Task<BookingResponseDTO> CreateBooking(BookingRequestDTO dto);
    Task<List<BookingResponseDTO>> GetBookingsByCustomer(int customerId);
    Task<BookingResponseDTO> GetBookingById(int bookingId);
    Task<List<BookingResponseDTO>> GetAllBookings();
    Task CancelBooking(int bookingId);
    Task UpdateBookingStatus(int bookingId, string status);
}
