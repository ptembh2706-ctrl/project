using Etour_Backend_dotnet.DTO.Customer;
using Etour_Backend_dotnet.Models;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;

namespace Etour_Backend_dotnet.Services.Impl;

public class CustomerService : ICustomerService
{
    private readonly etour_dbContext _context;

    public CustomerService(etour_dbContext context)
    {
        _context = context;
    }

    // ==========================
    // BULK UPLOAD (NPOI)
    // ==========================
    // ==========================
    // BULK UPLOAD (NPOI)
    // ==========================
    public async Task<List<customer_master>> UploadBulkCustomers(Stream fileStream)
    {
        var newCustomers = new List<customer_master>();

        try
        {
            // Use NPOI to load the workbook
            using (var memoryStream = new MemoryStream())
            {
                await fileStream.CopyToAsync(memoryStream);
                memoryStream.Position = 0;

                NPOI.SS.UserModel.IWorkbook workbook = new NPOI.XSSF.UserModel.XSSFWorkbook(memoryStream);
                var sheet = workbook.GetSheetAt(0);

                // Start from Row 1 (Skip Header Row 0)
                for (int i = 1; i <= sheet.LastRowNum; i++)
                {
                    var row = sheet.GetRow(i);
                    if (row == null) continue;

                    var email = GetCellValue(row.GetCell(1));
                    if (string.IsNullOrEmpty(email)) continue; // Skip if email missing

                    // Check if already exists
                    if (await _context.customer_master.AnyAsync(c => c.email == email))
                    {
                        continue; // Skip duplicates
                    }

                    var customer = new customer_master
                    {
                        name = GetCellValue(row.GetCell(0)),
                        email = email,
                        mobile_number = GetCellValue(row.GetCell(2)),
                        password = BCrypt.Net.BCrypt.HashPassword(GetCellValue(row.GetCell(3)) ?? "123456"), // Default or read password
                        address = GetCellValue(row.GetCell(4)),
                        city = GetCellValue(row.GetCell(5)),
                        state = GetCellValue(row.GetCell(6)),
                        role = "CUSTOMER"
                    };

                    _context.customer_master.Add(customer);
                    newCustomers.Add(customer);
                }

                await _context.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error processing Excel: {ex.Message}");
            throw;
        }

        return newCustomers;
    }

    private string GetCellValue(NPOI.SS.UserModel.ICell cell)
    {
        if (cell == null) return string.Empty;
        
        // Handle different cell types
        return cell.CellType switch
        {
            NPOI.SS.UserModel.CellType.String => cell.StringCellValue,
            NPOI.SS.UserModel.CellType.Numeric => cell.NumericCellValue.ToString(),
            NPOI.SS.UserModel.CellType.Boolean => cell.BooleanCellValue.ToString(),
            _ => cell.ToString()
        };
    }

    // ==========================
    // REGISTER CUSTOMER
    // ==========================
    // ==========================
    // REGISTER CUSTOMER
    // ==========================
    public async Task<CustomerDTO> RegisterCustomer(customer_master customer)
    {
        // Check if email already exists
        if (await _context.customer_master.AnyAsync(c => c.email == customer.email))
        {
            throw new Exception("Email is already in use!");
        }

        // Hash the password
        customer.password = BCrypt.Net.BCrypt.HashPassword(customer.password);

        // Set default role if not provided
        if (string.IsNullOrEmpty(customer.role))
        {
            customer.role = "CUSTOMER";
        }

        _context.customer_master.Add(customer);
        await _context.SaveChangesAsync();

        Console.WriteLine($"DEBUG: Customer registered - ID: {customer.customer_id}, Email: {customer.email}");
        return new CustomerDTO(customer);
    }

    // ==========================
    // GET ALL CUSTOMERS
    // ==========================
    // ==========================
    // GET ALL CUSTOMERS
    // ==========================
    public async Task<List<CustomerDTO>> GetAllCustomers()
    {
        return await _context.customer_master
            .Select(c => new CustomerDTO(c))
            .ToListAsync();
    }

    // ==========================
    // GET CUSTOMER BY ID
    // ==========================
    public async Task<CustomerDTO> GetCustomerById(int id)
    {
        var customer = await _context.customer_master.FirstOrDefaultAsync(c => c.customer_id == id)
            ?? throw new Exception($"Customer not found with ID: {id}");
        return new CustomerDTO(customer);
    }

    // ==========================
    // UPDATE CUSTOMER
    // ==========================
    // ==========================
    // UPDATE CUSTOMER
    // ==========================
    public async Task<CustomerDTO> UpdateCustomer(int id, customer_master updatedCustomer)
    {
        var customer = await _context.customer_master.FirstOrDefaultAsync(c => c.customer_id == id)
            ?? throw new Exception($"Customer not found with ID: {id}");

        // Update fields
        customer.name = updatedCustomer.name ?? customer.name;
        customer.email = updatedCustomer.email ?? customer.email;
        customer.mobile_number = updatedCustomer.mobile_number ?? customer.mobile_number;
        customer.address = updatedCustomer.address ?? customer.address;
        customer.city = updatedCustomer.city ?? customer.city;
        customer.state = updatedCustomer.state ?? customer.state;

        // Update password only if provided
        if (!string.IsNullOrEmpty(updatedCustomer.password))
        {
            customer.password = BCrypt.Net.BCrypt.HashPassword(updatedCustomer.password);
        }

        await _context.SaveChangesAsync();
        Console.WriteLine($"DEBUG: Customer updated - ID: {id}");
        return new CustomerDTO(customer);
    }

    // ==========================
    // DELETE CUSTOMER
    // ==========================
    public async Task DeleteCustomer(int id)
    {
        var customer = await _context.customer_master.FirstOrDefaultAsync(c => c.customer_id == id)
            ?? throw new Exception($"Customer not found with ID: {id}");

        _context.customer_master.Remove(customer);
        await _context.SaveChangesAsync();
        Console.WriteLine($"DEBUG: Customer deleted - ID: {id}");
    }

    // ==========================
    // LOGIN CUSTOMER (Legacy)
    // ==========================
    // ==========================
    // LOGIN CUSTOMER (Legacy)
    // ==========================
    public async Task<CustomerDTO?> LoginCustomer(string email, string password)
    {
        var customer = await _context.customer_master.FirstOrDefaultAsync(c => c.email == email);
        
        if (customer == null)
            return null;

        if (!BCrypt.Net.BCrypt.Verify(password, customer.password))
            return null;

        Console.WriteLine($"DEBUG: Customer logged in - ID: {customer.customer_id}");
        return new CustomerDTO(customer);
    }

    // ==========================
    // GET CUSTOMER BY EMAIL
    // ==========================
    public async Task<customer_master?> GetCustomerByEmail(string email)
    {
        return await _context.customer_master.FirstOrDefaultAsync(c => c.email == email);
    }
}
