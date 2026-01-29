package com.etour.app.invoice.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.etour.app.email.service.EmailService;
import com.etour.app.email.util.EmailTemplateUtil;
import com.etour.app.invoice.dto.InvoiceResponseDTO;
import com.etour.app.invoice.service.InvoiceService;
import com.etour.app.invoice.util.InvoicePdfGenerator;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final EmailService emailService;

    public InvoiceController(
            InvoiceService invoiceService,
            EmailService emailService
    ) {
        this.invoiceService = invoiceService;
        this.emailService = emailService;
    }

    @GetMapping("/{bookingId}/download")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long bookingId) {

        // 1. Generate invoice data
        InvoiceResponseDTO invoice = invoiceService.generateInvoice(bookingId);

        // 2. Generate PDF
        byte[] pdfBytes = InvoicePdfGenerator.generateInvoicePdf(invoice);

        // 3. Prepare headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData(
                "attachment",
                invoice.getInvoiceNumber() + ".pdf"
        );

        // 4. Return response
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(pdfBytes);
    }
    
    /**
     * Manual resend invoice email
     * Used by support/admin or customer retry
     */
    @PostMapping("/{bookingId}/resend-email")
    public ResponseEntity<String> resendInvoiceEmail(
            @PathVariable Long bookingId
    ) {

        // 1️⃣ Generate invoice (validates CONFIRMED + SUCCESS internally)
        InvoiceResponseDTO invoice =
                invoiceService.generateInvoice(bookingId);

        // 2️⃣ Generate PDF
        byte[] pdfBytes =
                InvoicePdfGenerator.generateInvoicePdf(invoice);

        // 3️⃣ Send email (async, non-blocking)
        emailService.sendInvoiceEmail(
                invoice.getCustomer().getEmail(),
                "Your E-Tour India Invoice – Booking #" + bookingId,
                EmailTemplateUtil.invoiceEmailBody(
                        invoice.getCustomer().getName(),
                        bookingId
                ),
                pdfBytes,
                "ETour-Invoice-" + bookingId + ".pdf"
        );

        return ResponseEntity.ok(
                "Invoice email resend initiated successfully"
        );
    }
    
}
