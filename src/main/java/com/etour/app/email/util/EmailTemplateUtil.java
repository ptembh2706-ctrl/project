package com.etour.app.email.util;

public class EmailTemplateUtil {

    public static String invoiceEmailBody(
            String customerName,
            Long bookingId
    ) {
        return """
                Dear %s,

                Thank you for booking with E-Tour India.

                Your booking (ID: %d) has been successfully confirmed.
                Please find the attached invoice for your reference.

                If you need assistance, contact us at support@etourindia.com.

                Regards,
                E-Tour India
                """.formatted(customerName, bookingId);
    }
}
