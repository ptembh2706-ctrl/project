using Etour_Backend_dotnet.DTO.Payment;

namespace Etour_Backend_dotnet.Services;

public interface IPaymentService
{
    Task<PaymentDTO> AddPayment(PaymentDTO dto);
    Task<List<PaymentDTO>> GetAllPayments();
    Task<PaymentDTO> GetPaymentById(int id);
    Task<List<PaymentDTO>> GetPaymentsByBooking(int bookingId);
    Task<PaymentDTO> UpdatePaymentStatus(int id, string status);
    Task<PaymentDTO?> GetPaymentByTransactionId(string transactionId);
    Task DeletePayment(int id);
}
