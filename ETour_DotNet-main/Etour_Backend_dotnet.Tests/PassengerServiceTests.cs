using Etour_Backend_dotnet.Models;
using Etour_Backend_dotnet.Services.Impl;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Etour_Backend_dotnet.DTO.Booking;

namespace Etour_Backend_dotnet.Tests;

public class PassengerServiceTests
{
    private DbContextOptions<etour_dbContext> CreateNewContextOptions()
    {
        // Create a fresh service provider, and therefore a fresh 
        // in-memory database instance.
        return new DbContextOptionsBuilder<etour_dbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
    }

    [Fact]
    public async Task GetAllPassengers_ShouldReturnAllPassengers()
    {
        // Arrange
        var options = CreateNewContextOptions();
        using (var context = new etour_dbContext(options))
        {
            context.passenger_master.Add(new passenger_master { passenger_id = 1, passenger_name = "John Doe", passenger_type = "Adult", passenger_amount = 1000 });
            context.passenger_master.Add(new passenger_master { passenger_id = 2, passenger_name = "Jane Doe", passenger_type = "Adult", passenger_amount = 1000 });
            await context.SaveChangesAsync();
        }

        using (var context = new etour_dbContext(options))
        {
            var service = new PassengerService(context);

            // Act
            var result = await service.GetAllPassengers();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Contains(result, p => p.PassengerName == "John Doe");
            Assert.Contains(result, p => p.PassengerName == "Jane Doe");
        }
    }

    [Fact]
    public async Task AddPassenger_ShouldAddPassengerToDatabase()
    {
        // Arrange
        var options = CreateNewContextOptions();
        var passenger = new passenger_master 
        { 
            passenger_id = 3, 
            passenger_name = "New Passenger", 
            passenger_type = "Child", 
            passenger_amount = 500 
        };

        using (var context = new etour_dbContext(options))
        {
            var service = new PassengerService(context);

            // Act
            var result = await service.AddPassenger(passenger);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("New Passenger", result.passenger_name);
            Assert.Equal(1, await context.passenger_master.CountAsync());
        }
    }

    [Fact]
    public async Task GetPassengerById_ShouldReturnCorrectPassenger()
    {
        // Arrange
        var options = CreateNewContextOptions();
        using (var context = new etour_dbContext(options))
        {
            context.passenger_master.Add(new passenger_master { passenger_id = 10, passenger_name = "Target Passenger", passenger_type = "Adult" });
            await context.SaveChangesAsync();
        }

        using (var context = new etour_dbContext(options))
        {
            var service = new PassengerService(context);

            // Act
            var result = await service.GetPassengerById(10);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Target Passenger", result.passenger_name);
        }
    }

    [Fact]
    public async Task DeletePassenger_ShouldRemovePassenger()
    {
        // Arrange
        var options = CreateNewContextOptions();
        using (var context = new etour_dbContext(options))
        {
            context.passenger_master.Add(new passenger_master { passenger_id = 10, passenger_name = "To Delete", passenger_type = "Adult" });
            await context.SaveChangesAsync();
        }

        using (var context = new etour_dbContext(options))
        {
            var service = new PassengerService(context);

            // Act
            await service.DeletePassenger(10);

            // Assert
            Assert.Equal(0, await context.passenger_master.CountAsync());
        }
    }
}
