using Microsoft.AspNetCore.Mvc;
using Etour_Backend_dotnet.DTO.Auth;
using Etour_Backend_dotnet.Models;
using Etour_Backend_dotnet.Services;
using Etour_Backend_dotnet.Utils;
using BCrypt.Net;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;

namespace Etour_Backend_dotnet.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly ICustomerService _customerService;
    private readonly JwtUtils _jwtUtils;
    private readonly etour_dbContext _context;

    public AuthController(
        ICustomerService customerService,
        JwtUtils jwtUtils,
        etour_dbContext context)
    {
        _customerService = customerService;
        _jwtUtils = jwtUtils;
        _context = context;
    }

    // ==========================
    // REGISTER
    // ==========================
    [HttpPost("register")]
    public IActionResult Register([FromBody] customer_master customer)
    {
        try
        {
            // Check if email exists
            if (_context.customer_master.Any(c => c.email == customer.email))
            {
                return BadRequest(new { message = "Email is already in use!" });
            }

            // Hash password
            customer.password = BCrypt.Net.BCrypt.HashPassword(customer.password);

            // Set default role or force override USER
            if (string.IsNullOrEmpty(customer.role) || customer.role.ToUpper() == "USER")
            {
                customer.role = "CUSTOMER";
            }
            Console.WriteLine($"DEBUG: Registering with Role: {customer.role}");

            _context.customer_master.Add(customer);
            _context.SaveChanges();

            // Generate JWT token
            string token = _jwtUtils.GenerateToken(customer);

            var response = new AuthResponseDTO(
                token,
                customer.customer_id,
                customer.name,
                customer.email,
                customer.role
            );

            Console.WriteLine($"DEBUG: User registered - ID: {customer.customer_id}, Email: {customer.email}");
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ==========================
    // LOGIN
    // ==========================
    [HttpPost("login")]
    public IActionResult Login([FromBody] AuthRequestDTO request)
    {
        try
        {
            var customer = _context.customer_master.FirstOrDefault(c => c.email == request.Email);

            if (customer == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(request.Password, customer.password))
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Generate JWT token
            string token = _jwtUtils.GenerateToken(customer);

            var response = new AuthResponseDTO(
                token,
                customer.customer_id,
                customer.name,
                customer.email,
                customer.role
            );

            Console.WriteLine($"DEBUG: User logged in - ID: {customer.customer_id}, Email: {customer.email}");
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ==========================
    // FORGOT PASSWORD
    // ==========================
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var customer = _context.customer_master.FirstOrDefault(c => c.email == request.Email);

        // Always return same message for security
        string successMessage = "If an account exists with this email, a reset link has been sent.";

        if (customer == null)
        {
            return Ok(new { message = successMessage });
        }

        // Generate reset token
        string token = Guid.NewGuid().ToString();
        customer.reset_password_token = token;
        customer.reset_password_token_expiry = DateTime.Now.AddMinutes(15);
        _context.SaveChanges();

        // Build reset link (frontend URL)
        string resetLink = $"http://localhost:5173/reset-password?token={token}";
        Console.WriteLine($"DEBUG: Password Reset Link: {resetLink}");

        // TODO: Send email with reset link
        // For now, just log it

        return Ok(new { message = successMessage });
    }

    // ==========================
    // RESET PASSWORD
    // ==========================
    [HttpPost("reset-password")]
    public IActionResult ResetPassword([FromBody] ResetPasswordRequest request)
    {
        if (string.IsNullOrEmpty(request.Token) || string.IsNullOrEmpty(request.NewPassword))
        {
            return BadRequest(new { message = "Token and new password are required." });
        }

        var customer = _context.customer_master
            .FirstOrDefault(c => c.reset_password_token == request.Token);

        if (customer == null)
        {
            return BadRequest(new { message = "Invalid token." });
        }

        if (customer.reset_password_token_expiry < DateTime.Now)
        {
            return BadRequest(new { message = "Token has expired." });
        }

        // Update password
        customer.password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        customer.reset_password_token = null;
        customer.reset_password_token_expiry = null;
        _context.SaveChanges();

        Console.WriteLine($"DEBUG: Password reset for customer ID: {customer.customer_id}");
        return Ok(new { message = "Password reset successfully. You can now login." });
    }

    // ==========================
    // GOOGLE SSO
    // ==========================
    [HttpGet("login-google")]
    public IActionResult LoginGoogle()
    {
        var properties = new Microsoft.AspNetCore.Authentication.AuthenticationProperties 
        { 
            RedirectUri = Url.Action("GoogleResponse") 
        };
        return Challenge(properties, Microsoft.AspNetCore.Authentication.Google.GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("google-response")]
    public async Task<IActionResult> GoogleResponse()
    {
        // Authenticate using the Cookie Scheme we set in Program.cs
        var result = await HttpContext.AuthenticateAsync("GoogleCookie");
        if (!result.Succeeded)
            return BadRequest("Google authentication failed.");

        var claims = result.Principal.Identities.FirstOrDefault().Claims;
        var email = claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;
        var name = claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Name)?.Value;
        var googleId = claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(email))
            return BadRequest("Email claim not found from Google.");

        // Check or Create User
        var customer = _context.customer_master.FirstOrDefault(c => c.email == email);
        if (customer == null)
        {
            customer = new customer_master
            {
                email = email,
                name = name ?? "Google User",
                password = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()), // Random Password
                role = "CUSTOMER",
                // Make other fields optional/null if possible, or sets defaults
                mobile_number = "0000000000",
                address = "Google Account",
                city = "Unknown",
                state = "Unknown"
            };
            _context.customer_master.Add(customer);
            _context.SaveChanges();
        }

        // Generate JWT
        string token = _jwtUtils.GenerateToken(customer);

        // Redirect to Frontend
        return Redirect($"http://localhost:5173/login?token={token}");
    }
}

// Request DTOs
public class ForgotPasswordRequest
{
    public string Email { get; set; } = string.Empty;
}

public class ResetPasswordRequest
{
    public string Token { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
