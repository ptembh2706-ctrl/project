using Etour_Backend_dotnet.DTO.Booking;
using Etour_Backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace Etour_Backend_dotnet.Services.Impl;

public class PassengerService : IPassengerService
{
    private readonly etour_dbContext _context;

    public PassengerService(etour_dbContext context)
    {
        _context = context;
    }

    // ==========================
    // GET ALL PASSENGERS
    // ==========================
    public async Task<List<PassengerResponseDTO>> GetAllPassengers()
    {
        return await _context.passenger_master
            .Select(p => new PassengerResponseDTO
            {
                PassengerId = p.passenger_id,
                PassengerName = p.passenger_name,
                DateOfBirth = p.date_of_birth ?? DateOnly.MinValue,
                Gender = "",
                PassengerType = p.passenger_type,
                PassengerAmount = p.passenger_amount
            })
            .ToListAsync();
    }

    // ==========================
    // ADD PASSENGER
    // ==========================
    public async Task<passenger_master> AddPassenger(passenger_master passenger)
    {
        _context.passenger_master.Add(passenger);
        await _context.SaveChangesAsync();
        return passenger;
    }

    // ==========================
    // GET BY BOOKING ID
    // ==========================
    public async Task<List<PassengerResponseDTO>> GetPassengersByBookingId(int bookingId)
    {
        return await _context.passenger_master
            .Where(p => p.booking_id == bookingId)
            .Select(p => new PassengerResponseDTO
            {
                PassengerId = p.passenger_id,
                PassengerName = p.passenger_name,
                DateOfBirth = p.date_of_birth ?? DateOnly.MinValue,
                Gender = "",
                PassengerType = p.passenger_type,
                PassengerAmount = p.passenger_amount
            })
            .ToListAsync();
    }

    // ==========================
    // GET BY ID
    // ==========================
    public async Task<passenger_master> GetPassengerById(int passengerId)
    {
        return await _context.passenger_master.FirstOrDefaultAsync(p => p.passenger_id == passengerId)
            ?? throw new Exception($"Passenger not found with ID: {passengerId}");
    }

    // ==========================
    // DELETE PASSENGER
    // ==========================
    public async Task DeletePassenger(int passengerId)
    {
        var passenger = await _context.passenger_master.FirstOrDefaultAsync(p => p.passenger_id == passengerId)
            ?? throw new Exception($"Passenger not found with ID: {passengerId}");

        _context.passenger_master.Remove(passenger);
        await _context.SaveChangesAsync();
    }
}
