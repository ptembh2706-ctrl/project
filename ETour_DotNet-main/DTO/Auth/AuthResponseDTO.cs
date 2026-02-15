namespace Etour_Backend_dotnet.DTO.Auth;

public class AuthResponseDTO
{
    public string Token { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Role { get; set; }

    public AuthResponseDTO() { }

    public AuthResponseDTO(string token, int customerId, string? name, string? email, string? role)
    {
        Token = token;
        CustomerId = customerId;
        Name = name;
        Email = email;
        Role = role;
    }
}
