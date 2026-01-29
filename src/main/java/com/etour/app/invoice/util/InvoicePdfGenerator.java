package com.etour.app.invoice.util;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.etour.app.invoice.dto.InvoicePassengerDTO;
import com.etour.app.invoice.dto.InvoiceResponseDTO;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;

public class InvoicePdfGenerator {

    private InvoicePdfGenerator() {}

    public static byte[] generateInvoicePdf(InvoiceResponseDTO invoice) {

        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            /* ---------------- FONTS ---------------- */
            Font companyFont = new Font(Font.HELVETICA, 20, Font.BOLD);
            Font titleFont   = new Font(Font.HELVETICA, 14, Font.BOLD);
            Font headerFont  = new Font(Font.HELVETICA, 11, Font.BOLD);
            Font normalFont  = new Font(Font.HELVETICA, 10);
            Font boldFont    = new Font(Font.HELVETICA, 10, Font.BOLD);

            /* ---------------- COMPANY HEADER ---------------- */
            Paragraph company = new Paragraph("E-Tour India", companyFont);
            company.setAlignment(Element.ALIGN_LEFT);

            Paragraph subtitle = new Paragraph(
                    "Travel & Experiences Pvt. Ltd.\n" +
                    "support@etourindia.com | +91-XXXXXXXXXX",
                    normalFont
            );
            subtitle.setSpacingAfter(10);

            Paragraph invoiceTitle = new Paragraph("INVOICE", titleFont);
            invoiceTitle.setAlignment(Element.ALIGN_RIGHT);
            invoiceTitle.setSpacingAfter(15);

            document.add(company);
            document.add(subtitle);
            document.add(invoiceTitle);

            /* ---------------- INVOICE META ---------------- */
            PdfPTable meta = new PdfPTable(2);
            meta.setWidthPercentage(100);
            meta.setSpacingAfter(15);

            meta.addCell(cell("Invoice No", boldFont));
            meta.addCell(cell(invoice.getInvoiceNumber(), normalFont));

            meta.addCell(cell("Invoice Date", boldFont));
            meta.addCell(cell(formatDateTime(invoice.getInvoiceDate()), normalFont));

            document.add(meta);
            addLine(document);

            /* ---------------- CUSTOMER ---------------- */
            document.add(section("Customer Details", headerFont));
            PdfPTable customer = table(2);
            customer.addCell(cell("Name", boldFont));
            customer.addCell(cell(invoice.getCustomer().getName(), normalFont));
            customer.addCell(cell("Email", boldFont));
            customer.addCell(cell(invoice.getCustomer().getEmail(), normalFont));
            customer.addCell(cell("Mobile", boldFont));
            customer.addCell(cell(invoice.getCustomer().getMobileNumber(), normalFont));
            document.add(customer);
            addLine(document);

            /* ---------------- BOOKING ---------------- */
            document.add(section("Booking Details", headerFont));
            PdfPTable booking = table(2);
            booking.addCell(cell("Booking ID", boldFont));
            booking.addCell(cell(String.valueOf(invoice.getBooking().getBookingId()), normalFont));
            booking.addCell(cell("Booking Date", boldFont));
            booking.addCell(cell(formatDate(invoice.getBooking().getBookingDate()), normalFont));
            booking.addCell(cell("Status", boldFont));
            booking.addCell(cell(invoice.getBooking().getBookingStatus(), normalFont));
            document.add(booking);
            addLine(document);

            /* ---------------- TOUR ---------------- */
            document.add(section("Tour Details", headerFont));
            PdfPTable tour = table(2);
            tour.addCell(cell("Description", boldFont));
            tour.addCell(cell(invoice.getTour().getDescription(), normalFont));
            tour.addCell(cell("Departure Date", boldFont));
            tour.addCell(cell(formatDate(invoice.getDeparture().getDepartureDate()), normalFont));
            tour.addCell(cell("End Date", boldFont));
            tour.addCell(cell(formatDate(invoice.getDeparture().getEndDate()), normalFont));
            tour.addCell(cell("No. of Days", boldFont));
            tour.addCell(cell(String.valueOf(invoice.getDeparture().getNumberOfDays()), normalFont));
            document.add(tour);
            addLine(document);

            /* ---------------- PASSENGERS ---------------- */
            document.add(section("Passenger Details", headerFont));
            PdfPTable passengers = new PdfPTable(3);
            passengers.setWidthPercentage(100);
            passengers.addCell(cell("Name", boldFont));
            passengers.addCell(cell("Type", boldFont));
            passengers.addCell(cell("Amount", boldFont));

            for (InvoicePassengerDTO p : invoice.getPassengers()) {
                passengers.addCell(cell(p.getPassengerName(), normalFont));
                passengers.addCell(cell(p.getPassengerType(), normalFont));
                passengers.addCell(cell(formatAmount(p.getPassengerAmount()), normalFont));
            }
            document.add(passengers);
            addLine(document);

            /* ---------------- PAYMENT ---------------- */
            document.add(section("Payment Details", headerFont));
            PdfPTable payment = table(2);
            payment.addCell(cell("Mode", boldFont));
            payment.addCell(cell(invoice.getPayment().getPaymentMode(), normalFont));
            payment.addCell(cell("Transaction ID", boldFont));
            payment.addCell(cell(invoice.getPayment().getTransactionId(), normalFont));
            payment.addCell(cell("Payment Date", boldFont));
            payment.addCell(cell(formatDateTime(invoice.getPayment().getPaymentDate()), normalFont));
            document.add(payment);
            addLine(document);

            /* ---------------- AMOUNT SUMMARY ---------------- */
            document.add(section("Amount Summary", headerFont));
            PdfPTable amount = table(2);
            amount.setWidthPercentage(50);

            amount.addCell(cell("Tour Amount", boldFont));
            amount.addCell(cell(formatAmount(invoice.getAmount().getTourAmount()), normalFont));
            amount.addCell(cell("Tax Amount", boldFont));
            amount.addCell(cell(formatAmount(invoice.getAmount().getTaxAmount()), normalFont));

            PdfPCell totalLabel = cell("Total Amount", boldFont);
            PdfPCell totalValue = cell(
                    formatAmount(invoice.getAmount().getTotalAmount()), boldFont
            );
            totalValue.setBackgroundColor(new Color(230, 230, 230));

            amount.addCell(totalLabel);
            amount.addCell(totalValue);

            document.add(amount);

            /* ---------------- FOOTER ---------------- */
            Paragraph footer = new Paragraph(
                    "This is a system-generated invoice and does not require a signature.\n" +
                    "Thank you for choosing E-Tour India.",
                    normalFont
            );
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(20);
            document.add(footer);

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error while generating invoice PDF", e);
        }
    }

    /* ---------------- HELPERS ---------------- */

    private static PdfPTable table(int cols) {
        PdfPTable t = new PdfPTable(cols);
        t.setWidthPercentage(100);
        t.setSpacingAfter(10);
        return t;
    }

    private static PdfPCell cell(String text, Font font) {
        PdfPCell c = new PdfPCell(new Phrase(text, font));
        c.setPadding(6);
        return c;
    }

    private static Paragraph section(String title, Font font) {
        Paragraph p = new Paragraph(title, font);
        p.setSpacingBefore(12);
        p.setSpacingAfter(6);
        return p;
    }

    private static void addLine(Document document) throws DocumentException {
        LineSeparator line = new LineSeparator();
        line.setLineWidth(0.5f);
        document.add(new Chunk(line));
    }

    private static String formatAmount(BigDecimal amount) {
        return "₹ " + String.format("%,.2f", amount);
    }

    private static String formatDate(LocalDate date) {
        return date.format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
    }

    private static String formatDateTime(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));
    }
}
