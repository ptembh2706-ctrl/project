using Etour_Backend_dotnet.DTO.Invoice;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Etour_Backend_dotnet.Utils;

public static class InvoicePdfGenerator
{
    static InvoicePdfGenerator()
    {
        // Set QuestPDF license (Community license for open-source projects)
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public static byte[] GenerateInvoicePdf(InvoiceResponseDTO invoice)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(30);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10));

                page.Header().Element(c => ComposeHeader(c, invoice));
                page.Content().Element(c => ComposeContent(c, invoice));
                page.Footer().Element(ComposeFooter);
            });
        });

        return document.GeneratePdf();
    }

    private static void ComposeHeader(IContainer container, InvoiceResponseDTO invoice)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item().Text("E-Tour India")
                    .FontSize(24).Bold().FontColor(Colors.Blue.Darken2);
                column.Item().Text("Your Travel Partner");
                column.Item().PaddingTop(5).Text("etour_india@outlook.com");
            });

            row.ConstantItem(150).Column(column =>
            {
                column.Item().AlignRight().Text("INVOICE")
                    .FontSize(20).Bold().FontColor(Colors.Grey.Darken2);
                column.Item().AlignRight().Text($"#{invoice.InvoiceNumber}");
                column.Item().AlignRight().Text($"Date: {invoice.GeneratedDate:dd MMM yyyy}");
            });
        });
    }

    private static void ComposeContent(IContainer container, InvoiceResponseDTO invoice)
    {
        container.PaddingVertical(20).Column(column =>
        {
            // Customer & Booking Info Row
            column.Item().Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text("Bill To:").SemiBold();
                    col.Item().Text(invoice.Customer.Name);
                    col.Item().Text(invoice.Customer.Email);
                    col.Item().Text(invoice.Customer.MobileNumber ?? "");
                    col.Item().Text($"{invoice.Customer.Address}, {invoice.Customer.City}");
                    col.Item().Text(invoice.Customer.State ?? "");
                });

                row.RelativeItem().Column(col =>
                {
                    col.Item().Text("Booking Details:").SemiBold();
                    col.Item().Text($"Booking ID: {invoice.Booking.BookingId}");
                    col.Item().Text($"Booking Date: {invoice.Booking.BookingDate:dd MMM yyyy}");
                    col.Item().Text($"Status: {invoice.Booking.BookingStatus}");
                    col.Item().Text($"Tour: {invoice.Tour.CategoryName}");
                });
            });

            column.Item().PaddingVertical(10).LineHorizontal(1).LineColor(Colors.Grey.Lighten2);

            // Tour Details
            column.Item().Text("Tour Information").FontSize(12).SemiBold();
            column.Item().PaddingBottom(5).Row(row =>
            {
                row.RelativeItem().Text($"Destination: {invoice.Tour.Description ?? invoice.Tour.CategoryName}");
            });
            column.Item().Row(row =>
            {
                row.RelativeItem().Text($"Departure: {invoice.Departure.DepartureDate:dd MMM yyyy}");
                row.RelativeItem().Text($"Return: {invoice.Departure.EndDate:dd MMM yyyy}");
                row.RelativeItem().Text($"Duration: {invoice.Departure.NumberOfDays} Days");
            });

            column.Item().PaddingVertical(10).LineHorizontal(1).LineColor(Colors.Grey.Lighten2);

            // Passengers Table
            column.Item().Text("Passenger Details").FontSize(12).SemiBold();
            column.Item().Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.ConstantColumn(30);  // #
                    columns.RelativeColumn(3);    // Name
                    columns.RelativeColumn(2);    // DOB
                    columns.RelativeColumn(2);    // Type
                    columns.RelativeColumn(2);    // Amount
                });

                table.Header(header =>
                {
                    header.Cell().Element(CellStyle).Text("#");
                    header.Cell().Element(CellStyle).Text("Passenger Name");
                    header.Cell().Element(CellStyle).Text("Date of Birth");
                    header.Cell().Element(CellStyle).Text("Type");
                    header.Cell().Element(CellStyle).AlignRight().Text("Amount");

                    static IContainer CellStyle(IContainer c) =>
                        c.DefaultTextStyle(x => x.SemiBold())
                         .Padding(5)
                         .Background(Colors.Grey.Lighten3);
                });

                int index = 1;
                foreach (var passenger in invoice.Passengers)
                {
                    table.Cell().Element(CellStyle).Text($"{index++}");
                    table.Cell().Element(CellStyle).Text(passenger.PassengerName);
                    table.Cell().Element(CellStyle).Text(passenger.DateOfBirth.ToString("dd MMM yyyy"));
                    table.Cell().Element(CellStyle).Text(passenger.PassengerType);
                    table.Cell().Element(CellStyle).AlignRight().Text($"₹{passenger.Amount:N2}");

                    static IContainer CellStyle(IContainer c) => c.Padding(5).BorderBottom(1).BorderColor(Colors.Grey.Lighten2);
                }
            });

            column.Item().PaddingVertical(10);

            // Amount Summary
            column.Item().AlignRight().Width(250).Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn();
                    columns.ConstantColumn(100);
                });

                table.Cell().Text("Tour Amount:");
                table.Cell().AlignRight().Text($"₹{invoice.Amount.TourAmount:N2}");

                table.Cell().Text("Tax (GST 5%):");
                table.Cell().AlignRight().Text($"₹{invoice.Amount.TaxAmount:N2}");

                table.Cell().Element(c => c.PaddingTop(5).BorderTop(1).BorderColor(Colors.Grey.Medium))
                     .Text("Total Amount:").Bold();
                table.Cell().Element(c => c.PaddingTop(5).BorderTop(1).BorderColor(Colors.Grey.Medium))
                     .AlignRight().Text($"₹{invoice.Amount.TotalAmount:N2}").Bold();

                table.Cell().Text("Paid Amount:").FontColor(Colors.Green.Darken2);
                table.Cell().AlignRight().Text($"₹{invoice.Amount.PaidAmount:N2}").FontColor(Colors.Green.Darken2);
            });

            column.Item().PaddingVertical(10).LineHorizontal(1).LineColor(Colors.Grey.Lighten2);

            // Payment Details
            column.Item().Text("Payment Information").FontSize(12).SemiBold();
            column.Item().Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text($"Transaction ID: {invoice.Payment.TransactionId}");
                    col.Item().Text($"Payment Date: {invoice.Payment.PaymentDate:dd MMM yyyy HH:mm}");
                    col.Item().Text($"Payment Mode: {invoice.Payment.PaymentMode}");
                    col.Item().Text($"Status: {invoice.Payment.PaymentStatus}")
                        .FontColor(invoice.Payment.PaymentStatus == "SUCCESS" ? Colors.Green.Medium : Colors.Red.Medium);
                });
            });
        });
    }

    private static void ComposeFooter(IContainer container)
    {
        container.Column(column =>
        {
            column.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten2);
            column.Item().PaddingTop(10).Row(row =>
            {
                row.RelativeItem().Text("Thank you for choosing E-Tour India!")
                    .FontSize(10).Italic().FontColor(Colors.Grey.Darken1);
                row.RelativeItem().AlignRight().Text(text =>
                {
                    text.Span("Page ").FontSize(9);
                    text.CurrentPageNumber().FontSize(9);
                    text.Span(" of ").FontSize(9);
                    text.TotalPages().FontSize(9);
                });
            });
        });
    }
}
