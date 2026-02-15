using Etour_Backend_dotnet.DTO.Invoice;
using Etour_Backend_dotnet.Models;
using Etour_Backend_dotnet.Utils;
using Microsoft.EntityFrameworkCore;

namespace Etour_Backend_dotnet.Services.Invoice;

public class InvoiceService : IInvoiceService
{
    private readonly etour_dbContext _context;

    public InvoiceService(etour_dbContext context)
    {
        _context = context;
    }

    public async Task<InvoiceResponseDTO> GenerateInvoice(int bookingId)
    {
        // Fetch booking with all related data
        var booking = await _context.booking_header
            .Include(b => b.customer)
            .Include(b => b.tour).ThenInclude(t => t.catmaster)
            .Include(b => b.departure_date)
            .Include(b => b.passenger_master)
            .Include(b => b.payment)
            .FirstOrDefaultAsync(b => b.booking_id == bookingId)
            ?? throw new Exception($"Booking not found with ID: {bookingId}");

        // Validate booking is confirmed
        if (booking.booking_status != "CONFIRMED")
        {
            throw new Exception($"Invoice can only be generated for CONFIRMED bookings. Current status: {booking.booking_status}");
        }

        // Get successful payment
        var payment = booking.payment.FirstOrDefault(p => p.payment_status == "SUCCESS")
            ?? throw new Exception("No successful payment found for this booking");

        // Build invoice response
        var invoice = new InvoiceResponseDTO
        {
            InvoiceNumber = $"INV-{bookingId:D6}-{DateTime.Now:yyyyMMdd}",
            GeneratedDate = DateTime.Now,

            Customer = new InvoiceCustomerDTO
            {
                Id = booking.customer.customer_id,
                Name = booking.customer.name ?? "N/A",
                Email = booking.customer.email ?? "N/A",
                MobileNumber = booking.customer.mobile_number,
                Address = booking.customer.address,
                City = booking.customer.city,
                State = booking.customer.state
            },

            Booking = new InvoiceBookingDTO
            {
                BookingId = booking.booking_id,
                BookingDate = booking.booking_date,
                BookingStatus = booking.booking_status,
                TotalPassengers = booking.total_passengers
            },

            Tour = new InvoiceTourDTO
            {
                TourId = booking.tour?.tour_id ?? 0,
                Description = booking.tour?.description,
                CategoryName = booking.tour?.catmaster?.name
            },

            Departure = new InvoiceDepartureDTO
            {
                DepartureDateId = booking.departure_date.departure_date_id,
                DepartureDate = booking.departure_date.departure_date,
                EndDate = booking.departure_date.end_date,
                NumberOfDays = booking.departure_date.number_of_days
            },

            Passengers = booking.passenger_master.Select(p => new InvoicePassengerDTO
            {
                PassengerId = p.passenger_id,
                PassengerName = p.passenger_name,
                DateOfBirth = p.date_of_birth ?? DateOnly.MinValue,
                Gender = "N/A", 
                PassengerType = p.passenger_type,
                Amount = p.passenger_amount
            }).ToList(),

            Payment = new InvoicePaymentDTO
            {
                PaymentId = payment.payment_id,
                TransactionId = payment.transaction_id,
                PaymentDate = payment.payment_date,
                PaymentMode = payment.payment_mode,
                PaymentStatus = payment.payment_status,
                PaidAmount = payment.paid_amount
            },

            Amount = new InvoiceAmountDTO
            {
                TourAmount = booking.tour_amount,
                TaxAmount = booking.tax_amount,
                TotalAmount = booking.total_amount,
                PaidAmount = payment.paid_amount,
                BalanceAmount = booking.total_amount - payment.paid_amount
            }
        };

        return invoice;
    }

    public async Task<byte[]> GenerateInvoicePdf(int bookingId)
    {
        var data = await GenerateInvoice(bookingId);
        return InvoicePdfGenerator.GenerateInvoicePdf(data);
    }
}
