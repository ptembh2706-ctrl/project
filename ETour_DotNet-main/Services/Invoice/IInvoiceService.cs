using Etour_Backend_dotnet.DTO.Invoice;

namespace Etour_Backend_dotnet.Services.Invoice;

public interface IInvoiceService
{
    Task<InvoiceResponseDTO> GenerateInvoice(int bookingId);
    Task<byte[]> GenerateInvoicePdf(int bookingId);
}
