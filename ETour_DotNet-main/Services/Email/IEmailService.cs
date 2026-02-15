namespace Etour_Backend_dotnet.Services.Email;

public interface IEmailService
{
    Task SendInvoiceEmailAsync(string toEmail, string subject, string body, byte[] pdfBytes, string fileName);
}
