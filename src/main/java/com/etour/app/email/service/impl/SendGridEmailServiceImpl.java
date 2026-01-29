package com.etour.app.email.service.impl;

import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.etour.app.email.service.EmailService;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Attachments;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

@Service
public class SendGridEmailServiceImpl implements EmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    @Value("${sendgrid.from.name}")
    private String fromName;

    /**
     * Sends invoice email asynchronously.
     * 
     * IMPORTANT:
     * - This method must NEVER throw exception
     * - Email failure must NOT affect payment or booking
     */
    @Async
    @Override
    public void sendInvoiceEmail(
            String to,
            String subject,
            String body,
            byte[] pdfBytes,
            String fileName) {

        try {
            Email from = new Email(fromEmail, fromName);
            Email toEmail = new Email(to);

            Content content = new Content("text/plain", body);
            Mail mail = new Mail(from, subject, toEmail, content);

            // ---------- PDF ATTACHMENT ----------
            Attachments attachment = new Attachments();
            attachment.setFilename(fileName);
            attachment.setType("application/pdf");
            attachment.setDisposition("attachment");
            attachment.setContent(
                    Base64.getEncoder().encodeToString(pdfBytes));

            mail.addAttachments(attachment);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            // Log failure but DO NOT throw
            if (response.getStatusCode() >= 400) {
                System.err.println(
                        "SendGrid email failed. Status: " +
                                response.getStatusCode() +
                                ", Body: " + response.getBody());
            }

        } catch (Exception e) {
            // CRITICAL RULE:
            // Never throw exception from async email
            System.err.println("Exception while sending invoice email to: " + to);
            e.printStackTrace();
        }
    }

    @Autowired
    private org.springframework.mail.javamail.JavaMailSender javaMailSender;

    @Async
    @Override
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        System.out.println("DEBUG: Starting Async SMTP Email Send to: " + toEmail);

        try {
            jakarta.mail.internet.MimeMessage message = javaMailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(
                    message, true);

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Password Reset Request - E-Tour");

            String bodyContent = "<!DOCTYPE html>"
                    + "<html>"
                    + "<head>"
                    + "<style>"
                    + "  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }"
                    + "  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }"
                    + "  .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #059669; padding-bottom: 20px; }"
                    + "  .logo { font-size: 28px; font-weight: bold; color: #059669; text-decoration: none; }"
                    + "  .content { color: #333333; line-height: 1.6; font-size: 16px; }"
                    + "  .button-container { text-align: center; margin: 30px 0; }"
                    + "  .button { background-color: #059669; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; }"
                    + "  .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; padding-top: 20px; }"
                    + "</style>"
                    + "</head>"
                    + "<body>"
                    + "  <div class='container'>"
                    + "    <div class='header'>"
                    + "      <a href='#' class='logo'>E-Tour India</a>"
                    + "    </div>"
                    + "    <div class='content'>"
                    + "      <h2 style='color: #2c3e50; margin-top: 0;'>Password Reset Request</h2>"
                    + "      <p>Hello,</p>"
                    + "      <p>We received a request to reset the password for your E-Tour account associated with this email address.</p>"
                    + "      <div class='button-container'>"
                    + "        <a href='" + resetLink + "' class='button'>Reset Your Password</a>"
                    + "      </div>"
                    + "      <p>If you didn't ask to reset your password, you can safely ignore this email. Your password will not change.</p>"
                    + "      <p>This link is valid for 15 minutes.</p>"
                    + "    </div>"
                    + "    <div class='footer'>"
                    + "      <p>&copy; 2024 E-Tour India. All rights reserved.</p>"
                    + "      <p>This is an automated message, please do not reply.</p>"
                    + "    </div>"
                    + "  </div>"
                    + "</body>"
                    + "</html>";

            helper.setText(bodyContent, true);

            javaMailSender.send(message);

            System.out.println("DEBUG: SMTP Email Sent Successfully");

        } catch (Exception ex) {
            System.err.println("ERROR: Failed to send password reset email via SMTP: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}
