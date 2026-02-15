using SendGrid;
using SendGrid.Helpers.Mail;

namespace Etour_Backend_dotnet.Services.Email;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly string _apiKey;
    private readonly string _fromEmail;
    private readonly string _fromName;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
        _apiKey = _configuration["SendGrid:ApiKey"] ?? throw new Exception("SendGrid ApiKey not configured");
        _fromEmail = _configuration["SendGrid:FromEmail"] ?? "noreply@etour.com";
        _fromName = _configuration["SendGrid:FromName"] ?? "E-Tour India";
    }

    public async Task SendInvoiceEmailAsync(string toEmail, string subject, string body, byte[] pdfBytes, string fileName)
    {
        try
        {
            var client = new SendGridClient(_apiKey);

            var from = new EmailAddress(_fromEmail, _fromName);
            var to = new EmailAddress(toEmail);

            var msg = MailHelper.CreateSingleEmail(from, to, subject, body, body);

            // Attach PDF
            var pdfBase64 = Convert.ToBase64String(pdfBytes);
            msg.AddAttachment(fileName, pdfBase64, "application/pdf");

            var response = await client.SendEmailAsync(msg);

            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine($"DEBUG: Invoice email sent successfully to {toEmail}");
            }
            else
            {
                Console.WriteLine($"ERROR: Failed to send email. Status: {response.StatusCode}");
                var responseBody = await response.Body.ReadAsStringAsync();
                Console.WriteLine($"ERROR: Response: {responseBody}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR: Email sending failed - {ex.Message}");
            throw;
        }
    }
}
