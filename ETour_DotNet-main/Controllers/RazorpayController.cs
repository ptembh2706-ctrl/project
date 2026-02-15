using Microsoft.AspNetCore.Mvc;
using Etour_Backend_dotnet.DTO.Razorpay;
using Etour_Backend_dotnet.Services.Razorpay;

namespace Etour_Backend_dotnet.Controllers;

[ApiController]
[Route("api/razorpay")]
public class RazorpayController : ControllerBase
{
    private readonly IRazorpayService _razorpayService;

    public RazorpayController(IRazorpayService razorpayService)
    {
        _razorpayService = razorpayService;
    }

    /// <summary>
    /// Create a Razorpay order for payment
    /// </summary>
    [HttpPost("create-order")]
    public IActionResult CreateOrder([FromBody] RazorpayOrderRequestDTO request)
    {
        try
        {
            var response = _razorpayService.CreateOrder(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
