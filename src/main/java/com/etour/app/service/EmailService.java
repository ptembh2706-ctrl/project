package com.etour.app.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    @Value("${sendgrid.from.name}")
    private String fromName;

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        Email from = new Email(fromEmail, fromName);
        Email to = new Email(toEmail);
        String subject = "Password Reset Request - E-Tour";
        
        String bodyContent = "<h3>Password Reset Request</h3>" +
                "<p>We received a request to reset your password.</p>" +
                "<p>Click the link below to reset it:</p>" +
                "<p><a href=\"" + resetLink + "\">Reset Password</a></p>" +
                "<p>If you didn't request this, you can safely ignore this email.</p>";

        Content content = new Content("text/html", bodyContent);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            
            System.out.println("Email sent status: " + response.getStatusCode());
            if (response.getStatusCode() >= 400) {
                System.err.println("Email failed: " + response.getBody());
            }
        } catch (IOException ex) {
            System.err.println("Error sending email: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}
