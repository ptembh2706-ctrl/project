using Etour_Backend_dotnet.DTO.Payment;
using Etour_Backend_dotnet.Models;
using Etour_Backend_dotnet.Services.Email;
using Etour_Backend_dotnet.Services.Invoice;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

namespace Etour_Backend_dotnet.Services.Impl;

public class PaymentService : IPaymentService
{
    private readonly etour_dbContext _context;
    private readonly IServiceScopeFactory _scopeFactory;

    public PaymentService(
        etour_dbContext context,
        IServiceScopeFactory scopeFactory)
    {
        _context = context;
        _scopeFactory = scopeFactory;
    }

    // ==========================
    // ADD PAYMENT (CRITICAL: Matches Java Implementation)
    // ==========================
    // ==========================
    // ADD PAYMENT (CRITICAL: Matches Java Implementation)
    // ==========================
    public async Task<PaymentDTO> AddPayment(PaymentDTO dto)
    {
        // 1️⃣ Validate booking exists
        var booking = await _context.booking_header.FirstOrDefaultAsync(b => b.booking_id == dto.BookingId)
            ?? throw new Exception($"Booking not found with ID: {dto.BookingId}");

        // 2️⃣ Validate booking status (only PENDING or FAILED allowed)
        var currentStatus = booking.booking_status?.ToUpperInvariant();
        if (currentStatus != "PENDING" && currentStatus != "FAILED")
        {
            throw new Exception($"Cannot process payment for booking with status: {booking.booking_status}");
        }

        // 3️⃣ Check for duplicate transaction ID
        if (!string.IsNullOrEmpty(dto.TransactionId))
        {
            var existingPayment = await _context.payment.FirstOrDefaultAsync(p => p.transaction_id == dto.TransactionId);
            if (existingPayment != null)
            {
                throw new Exception($"Transaction ID already exists: {dto.TransactionId}");
            }
        }

        // 4️⃣ For SUCCESS payments, validate amount matches booking total
        bool isSuccessPayment = dto.PaymentStatus?.ToUpperInvariant() == "SUCCESS";
        bool isAlreadyConfirmed = currentStatus == "CONFIRMED";

        if (isSuccessPayment)
        {
            if (isAlreadyConfirmed)
            {
                throw new Exception($"Booking is already CONFIRMED. Cannot process another payment.");
            }

            // Validate paid amount matches booking total
            if (dto.PaidAmount != booking.total_amount)
            {
                throw new Exception($"Paid amount ({dto.PaidAmount}) does not match booking total ({booking.total_amount})");
            }
        }

        // 5️⃣ For FAILED payments, paid amount should be 0
        if (dto.PaymentStatus?.ToUpperInvariant() == "FAILED" && dto.PaidAmount > 0)
        {
            dto.PaidAmount = 0; // Force to 0 for failed payments
        }

        // 6️⃣ Create payment entity
        var entity = new payment
        {
            booking_id = dto.BookingId,
            transaction_id = dto.TransactionId,
            payment_date = DateTime.Now,
            payment_mode = dto.PaymentMode,
            payment_status = dto.PaymentStatus,
            paid_amount = dto.PaidAmount,
            razorpay_order_id = dto.RazorpayOrderId,
            razorpay_payment_id = dto.RazorpayPaymentId,
            razorpay_signature = dto.RazorpaySignature
        };

        _context.payment.Add(entity);
        await _context.SaveChangesAsync();

        dto.PaymentId = entity.payment_id;

        // 7️⃣ UPDATE BOOKING STATUS TO CONFIRMED (CRITICAL!)
        bool bookingJustConfirmed = false;
        if (isSuccessPayment && !isAlreadyConfirmed)
        {
            booking.booking_status = "CONFIRMED";
            await _context.SaveChangesAsync();
            bookingJustConfirmed = true;
            Console.WriteLine($"DEBUG: Booking {booking.booking_id} status updated to CONFIRMED");
        }

        // 8️⃣ SEND INVOICE EMAIL (ONLY ON SUCCESS)
        if (bookingJustConfirmed)
        {
            try
            {
                // Send email asynchronously (fire and forget) with FRESH SCOPE
                _ = Task.Run(async () =>
                {
                    try
                    {
                        using (var scope = _scopeFactory.CreateScope())
                        {
                            var scopedInvoiceService = scope.ServiceProvider.GetRequiredService<IInvoiceService>();
                            var scopedEmailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

                            // Generate Invoice using SCOPED service (fresh DbContext)
                            var invoice = await scopedInvoiceService.GenerateInvoice(booking.booking_id);

                            // Re-build email body with fresh data (safe)
                            var emailBody = $@"
Dear {invoice.Customer.Name},

Thank you for booking with E-Tour India!

Your booking has been confirmed. Please find your invoice attached.

Booking Details:
- Booking ID: {invoice.Booking.BookingId}
- Booking Date: {invoice.Booking.BookingDate:dd-MMM-yyyy}
- Tour: {invoice.Tour.Description ?? invoice.Tour.CategoryName}
- Departure: {invoice.Departure.DepartureDate:dd-MMM-yyyy} to {invoice.Departure.EndDate:dd-MMM-yyyy}
- Total Passengers: {invoice.Booking.TotalPassengers}
- Total Amount: ₹{invoice.Amount.TotalAmount:N2}

We wish you a wonderful journey!

Best Regards,
E-Tour India Team
";

                            // Generate PDF
                            var pdfBytes = await scopedInvoiceService.GenerateInvoicePdf(booking.booking_id);

                            await scopedEmailService.SendInvoiceEmailAsync(
                                invoice.Customer.Email,
                                $"Your E-Tour India Invoice – Booking #{booking.booking_id}",
                                emailBody,
                                pdfBytes,
                                $"ETour-Invoice-{booking.booking_id}.pdf"
                            );
                            Console.WriteLine($"DEBUG: Invoice email sent to {invoice.Customer.Email}");
                        }
                    }
                    catch (Exception emailEx)
                    {
                        Console.WriteLine($"WARNING: Failed to send invoice email: {emailEx.Message}");
                    }
                });

            }
            catch (Exception ex)
            {
                // Email failure should NOT affect payment confirmation
                Console.WriteLine($"WARNING: Invoice/Email processing failed: {ex.Message}");
            }
        }

        Console.WriteLine($"DEBUG: Payment {entity.payment_id} created for Booking {dto.BookingId}, Status: {dto.PaymentStatus}");
        return dto;
    }

    // ==========================
    // GET ALL PAYMENTS
    // ==========================
    public async Task<List<PaymentDTO>> GetAllPayments()
    {
        return await _context.payment
            .Select(p => ToDTO(p))
            .ToListAsync();
    }

    // ==========================
    // GET PAYMENT BY ID
    // ==========================
    public async Task<PaymentDTO> GetPaymentById(int id)
    {
        var entity = await _context.payment.FirstOrDefaultAsync(p => p.payment_id == id)
            ?? throw new Exception($"Payment not found with ID: {id}");
        return ToDTO(entity);
    }

    // ==========================
    // GET PAYMENTS BY BOOKING
    // ==========================
    public async Task<List<PaymentDTO>> GetPaymentsByBooking(int bookingId)
    {
        return await _context.payment
            .Where(p => p.booking_id == bookingId)
            .Select(p => ToDTO(p))
            .ToListAsync();
    }

    // ==========================
    // UPDATE PAYMENT STATUS
    // ==========================
    public async Task<PaymentDTO> UpdatePaymentStatus(int id, string status)
    {
        var entity = await _context.payment.FirstOrDefaultAsync(p => p.payment_id == id)
            ?? throw new Exception($"Payment not found with ID: {id}");

        entity.payment_status = status;
        await _context.SaveChangesAsync();

        Console.WriteLine($"DEBUG: Payment {id} status updated to: {status}");
        return ToDTO(entity);
    }

    // ==========================
    // GET BY TRANSACTION ID
    // ==========================
    public async Task<PaymentDTO?> GetPaymentByTransactionId(string transactionId)
    {
        var entity = await _context.payment.FirstOrDefaultAsync(p => p.transaction_id == transactionId);
        return entity != null ? ToDTO(entity) : null;
    }

    // ==========================
    // DELETE PAYMENT
    // ==========================
    public async Task DeletePayment(int id)
    {
        var entity = await _context.payment.FirstOrDefaultAsync(p => p.payment_id == id)
            ?? throw new Exception($"Payment not found with ID: {id}");

        _context.payment.Remove(entity);
        await _context.SaveChangesAsync();
    }

    // ==========================
    // DTO MAPPER
    // ==========================
    private static PaymentDTO ToDTO(payment entity)
    {
        return new PaymentDTO
        {
            PaymentId = entity.payment_id,
            BookingId = entity.booking_id,
            TransactionId = entity.transaction_id,
            PaymentDate = entity.payment_date,
            PaymentMode = entity.payment_mode,
            PaymentStatus = entity.payment_status,
            PaidAmount = entity.paid_amount,
            RazorpayOrderId = entity.razorpay_order_id,
            RazorpayPaymentId = entity.razorpay_payment_id,
            RazorpaySignature = entity.razorpay_signature
        };
    }
}
