namespace Etour_Backend_dotnet.DTO.Customer;

public class CustomerDTO
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? MobileNumber { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Role { get; set; }

    // Constructor for mapping from entity
    public CustomerDTO() { }

    public CustomerDTO(Models.customer_master customer)
    {
        Id = customer.customer_id;
        Name = customer.name;
        Email = customer.email;
        MobileNumber = customer.mobile_number;
        Address = customer.address;
        City = customer.city;
        State = customer.state;
        Role = customer.role;
    }
}
