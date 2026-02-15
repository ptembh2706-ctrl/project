using Microsoft.AspNetCore.Mvc;
using Etour_Backend_dotnet.DTO.Customer;
using Etour_Backend_dotnet.Models;
using Etour_Backend_dotnet.Services;

namespace Etour_Backend_dotnet.Controllers;

[ApiController]
[Route("api/customers")]
public class CustomerController : ControllerBase
{
    private readonly ICustomerService _customerService;

    public CustomerController(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    // ==========================
    // REGISTER CUSTOMER
    // ==========================
    [HttpPost("register")]
    public async Task<IActionResult> RegisterCustomer([FromBody] customer_master customer)
    {
        try
        {
            var result = await _customerService.RegisterCustomer(customer);
            return StatusCode(201, result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ==========================
    // GET ALL CUSTOMERS
    // ==========================
    [HttpGet]
    public async Task<IActionResult> GetAllCustomers()
    {
        var customers = await _customerService.GetAllCustomers();
        return Ok(customers);
    }

    // ==========================
    // GET CUSTOMER BY ID
    // ==========================
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCustomerById(int id)
    {
        try
        {
            var customer = await _customerService.GetCustomerById(id);
            return Ok(customer);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ==========================
    // UPDATE CUSTOMER
    // ==========================
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCustomer(int id, [FromBody] customer_master customer)
    {
        try
        {
            var result = await _customerService.UpdateCustomer(id, customer);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ==========================
    // DELETE CUSTOMER
    // ==========================
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCustomer(int id)
    {
        try
        {
            await _customerService.DeleteCustomer(id);
            return Ok(new { message = "Customer deleted successfully" });
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateException)
        {
            return Conflict(new { message = "Cannot delete customer. Customer has associated bookings or data." });
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ==========================
    // LOGIN (Legacy - use /api/auth/login instead)
    // ==========================
    [HttpPost("login")]
    public async Task<IActionResult> LoginCustomer([FromBody] LoginRequest loginDetails)
    {
        var customer = await _customerService.LoginCustomer(loginDetails.Email, loginDetails.Password);
        if (customer != null)
        {
            return Ok(customer);
        }
        return Unauthorized(new { message = "Invalid email or password" });
    }

    // ==========================
    // BULK UPLOAD EXCEL
    // ==========================
    [HttpPost("uploadData")]
    public async Task<IActionResult> UploadData(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file uploaded" });

        if (!Path.GetExtension(file.FileName).Equals(".xlsx", StringComparison.OrdinalIgnoreCase) &&
            !Path.GetExtension(file.FileName).Equals(".xls", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Invalid file format. Please upload Excel file." });
        }

        try
        {
            using (var stream = file.OpenReadStream())
            {
                var customers = await _customerService.UploadBulkCustomers(stream);
                return Ok(customers);
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error processing file: " + ex.Message });
        }
    }
}

// Simple login request class
public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
