package com.etour.app.invoice.service;

import com.etour.app.invoice.dto.InvoiceResponseDTO;

public interface InvoiceService {

    InvoiceResponseDTO generateInvoice(Long bookingId);
}
