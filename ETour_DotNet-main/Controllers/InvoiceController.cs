using Microsoft.AspNetCore.Mvc;
using Etour_Backend_dotnet.Services.Invoice;
using Etour_Backend_dotnet.Services.Email;
using Etour_Backend_dotnet.Utils;

namespace Etour_Backend_dotnet.Controllers;

[ApiController]
[Route("api/invoices")]
public class InvoiceController : ControllerBase
{
    private readonly IInvoiceService _invoiceService;
    private readonly IEmailService _emailService;

    public InvoiceController(IInvoiceService invoiceService, IEmailService emailService)
    {
        _invoiceService = invoiceService;
        _emailService = emailService;
    }

    /// <summary>
    /// Download invoice PDF for a confirmed booking
    /// </summary>
    [HttpGet("{bookingId}/download")]
    public async Task<IActionResult> DownloadInvoice(int bookingId)
    {
        try
        {
            // Generate invoice data (not strictly needed here as PDF gen calls it, but cleaner separation)
            // But GenerateInvoicePdf calls it internally.
            
            // Generate PDF
            byte[] pdfBytes = await _invoiceService.GenerateInvoicePdf(bookingId);

            // Return PDF file
            // Need invoice number for filename. 
            // Optimally we'd get the object first.
            var invoice = await _invoiceService.GenerateInvoice(bookingId);
            
            return File(pdfBytes, "application/pdf", $"{invoice.InvoiceNumber}.pdf");
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Resend invoice email for a confirmed booking
    /// </summary>
    [HttpPost("{bookingId}/resend-email")]
    public async Task<IActionResult> ResendInvoiceEmail(int bookingId)
    {
        try
        {
            // Generate invoice
            var invoice = await _invoiceService.GenerateInvoice(bookingId);

            // Generate PDF
            byte[] pdfBytes = await _invoiceService.GenerateInvoicePdf(bookingId);

            // Build email body
            string emailBody = $@"
Dear {invoice.Customer.Name},

Thank you for booking with E-Tour India!

Your booking #{bookingId} has been confirmed. Please find your invoice attached to this email.

Booking Details:
- Destination: {invoice.Tour.CategoryName}
- Departure Date: {invoice.Departure.DepartureDate:dd MMM yyyy}
- Duration: {invoice.Departure.NumberOfDays} Days
- Total Amount: ₹{invoice.Amount.TotalAmount:N2}

If you have any questions, please contact us at etour_india@outlook.com.

Happy Travels!
E-Tour India Team
";

            // Send email
            await _emailService.SendInvoiceEmailAsync(
                invoice.Customer.Email,
                $"Your E-Tour India Invoice – Booking #{bookingId}",
                emailBody,
                pdfBytes,
                $"ETour-Invoice-{bookingId}.pdf"
            );

            return Ok(new { message = "Invoice email sent successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
