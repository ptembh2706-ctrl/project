using Microsoft.AspNetCore.Mvc;
using Etour_Backend_dotnet.DTO.Payment;
using Etour_Backend_dotnet.Services;

namespace Etour_Backend_dotnet.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    // ==========================
    // ADD PAYMENT
    // ==========================
    [HttpPost]
    public async Task<IActionResult> AddPayment([FromBody] PaymentDTO dto)
    {
        try
        {
            var result = await _paymentService.AddPayment(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ==========================
    // GET ALL PAYMENTS
    // ==========================
    [HttpGet]
    public async Task<IActionResult> GetAllPayments()
    {
        var payments = await _paymentService.GetAllPayments();
        return Ok(payments);
    }

    // ==========================
    // GET PAYMENT BY ID
    // ==========================
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPayment(int id)
    {
        try
        {
            var payment = await _paymentService.GetPaymentById(id);
            return Ok(payment);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ==========================
    // GET PAYMENTS BY BOOKING
    // ==========================
    [HttpGet("booking/{bookingId}")]
    public async Task<IActionResult> GetByBooking(int bookingId)
    {
        var payments = await _paymentService.GetPaymentsByBooking(bookingId);
        return Ok(payments);
    }

    // ==========================
    // UPDATE PAYMENT STATUS
    // ==========================
    [HttpPut("{id}/status/{status}")]
    public async Task<IActionResult> UpdateStatus(int id, string status)
    {
        try
        {
            var payment = await _paymentService.UpdatePaymentStatus(id, status);
            return Ok(payment);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ==========================
    // GET BY TRANSACTION ID
    // ==========================
    [HttpGet("transaction/{txn}")]
    public async Task<IActionResult> GetByTransaction(string txn)
    {
        var payment = await _paymentService.GetPaymentByTransactionId(txn);
        if (payment == null)
            return NotFound(new { message = "Payment not found" });
        return Ok(payment);
    }

    // ==========================
    // DELETE PAYMENT
    // ==========================
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _paymentService.DeletePayment(id);
            return Ok(new { message = "Payment deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
