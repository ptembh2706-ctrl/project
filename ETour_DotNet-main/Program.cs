using QuestPDF.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Serilog;
using Microsoft.EntityFrameworkCore;

namespace Etour_Backend_dotnet;

public class Program 
{
    public static void Main(string[] args)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        // ========================================
        // 0. Serilog BOOTSTRAP
        // ========================================
        Log.Logger = new LoggerConfiguration()
            .WriteTo.Console()
            .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
            .CreateLogger();

        try 
        {
            var builder = WebApplication.CreateBuilder(args);

            // Use Serilog
            builder.Host.UseSerilog();

            // ========================================
            // 1. Configure Services
            // ========================================

            // Add Controllers with Global Logging Filter
            builder.Services.AddControllers(options => 
            {
                options.Filters.Add<Etour_Backend_dotnet.Filters.LogActionFilter>();
            })
            .AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });

            // Add DbContext with Connection String from Configuration
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<Etour_Backend_dotnet.Models.etour_dbContext>(options =>
                options.UseMySql(connectionString, Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.44-mysql")));

            // Add JWT Authentication
            var jwtSettings = builder.Configuration.GetSection("Jwt");
            var secretKey = jwtSettings["Secret"];

            if (string.IsNullOrEmpty(secretKey))
            {
                throw new Exception("JWT Secret is missing in appsettings.json");
            }

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtSettings["Issuer"],
                        ValidAudience = jwtSettings["Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
                    };
                })
                .AddCookie("GoogleCookie") // Add Cookie Scheme for OAuth intermediate state
                .AddGoogle(googleOptions =>
                {
                    googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
                    googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
                    googleOptions.SignInScheme = "GoogleCookie"; // Tell Google to sign in to this cookie
                });

            // Add Swagger/OpenAPI
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Title = "ETour Backend API",
                    Version = "v1",
                    Description = "ETour India - Tour Booking API"
                });
                // Add JWT Definition to Swagger
                 c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });
                c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                {
                    {
                        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                        {
                            Reference = new Microsoft.OpenApi.Models.OpenApiReference
                            {
                                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            // Add CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            // Register Services (Dependency Injection)
            builder.Services.AddScoped<Etour_Backend_dotnet.Services.IBookingService, Etour_Backend_dotnet.Services.Impl.BookingService>();
            builder.Services.AddScoped<Etour_Backend_dotnet.Services.IPaymentService, Etour_Backend_dotnet.Services.Impl.PaymentService>();
            builder.Services.AddScoped<Etour_Backend_dotnet.Services.ICustomerService, Etour_Backend_dotnet.Services.Impl.CustomerService>();
            builder.Services.AddScoped<Etour_Backend_dotnet.Services.IDepartureService, Etour_Backend_dotnet.Services.Impl.DepartureService>();
            builder.Services.AddScoped<Etour_Backend_dotnet.Services.ICostService, Etour_Backend_dotnet.Services.Impl.CostServiceImpl>();
            builder.Services.AddScoped<Etour_Backend_dotnet.Services.IItineraryService, Etour_Backend_dotnet.Services.Impl.ItineraryService>();
            builder.Services.AddScoped<Etour_Backend_dotnet.Services.IPassengerService, Etour_Backend_dotnet.Services.Impl.PassengerService>();
            builder.Services.AddScoped<Etour_Backend_dotnet.Services.ITourService, Etour_Backend_dotnet.Services.Impl.TourService>();
            builder.Services.AddScoped<Etour_Backend_dotnet.Services.ICategoryService, Etour_Backend_dotnet.Services.Impl.CategoryService>();
            builder.Services.AddScoped<Etour_Backend_dotnet.Services.Razorpay.IRazorpayService, Etour_Backend_dotnet.Services.Razorpay.RazorpayService>();
            builder.Services.AddScoped<Etour_Backend_dotnet.Services.Razorpay.IRazorpayVerifyService, Etour_Backend_dotnet.Services.Razorpay.RazorpayVerifyService>();
            builder.Services.AddScoped<Etour_Backend_dotnet.Services.Invoice.IInvoiceService, Etour_Backend_dotnet.Services.Invoice.InvoiceService>();
            builder.Services.AddScoped<Etour_Backend_dotnet.Services.Email.IEmailService, Etour_Backend_dotnet.Services.Email.EmailService>();
            builder.Services.AddScoped<Etour_Backend_dotnet.Utils.JwtUtils>();

            var app = builder.Build();

            // ========================================
            // 2. Configure HTTP Pipeline
            // ========================================

            // Enable CORS
            app.UseCors("AllowFrontend");

            // Global Exception Handler
            app.UseMiddleware<Etour_Backend_dotnet.Middleware.GlobalExceptionMiddleware>();

            // Enable Swagger (both Dev and Prod for API testing)
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "ETour API v1");
            });

            app.UseHttpsRedirection();

            // Enable Static Files (for images)
            app.UseStaticFiles();

            // AUTHENTICATION & AUTHORIZATION
            app.UseAuthentication(); // Must be before Authorization
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "Application start-up failed");
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }
}
