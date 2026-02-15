using Etour_Backend_dotnet.DTO.Customer;
using Etour_Backend_dotnet.Models;

namespace Etour_Backend_dotnet.Services;

public interface ICustomerService
{
    Task<CustomerDTO> RegisterCustomer(customer_master customer);
    Task<List<CustomerDTO>> GetAllCustomers();
    Task<CustomerDTO> GetCustomerById(int id);
    Task<CustomerDTO> UpdateCustomer(int id, customer_master customer);
    Task DeleteCustomer(int id);
    Task<CustomerDTO?> LoginCustomer(string email, string password);
    Task<List<customer_master>> UploadBulkCustomers(Stream fileStream);
    Task<customer_master?> GetCustomerByEmail(string email);
}
