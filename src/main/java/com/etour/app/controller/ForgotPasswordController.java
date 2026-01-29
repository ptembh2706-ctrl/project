package com.etour.app.controller;

import com.etour.app.entity.CustomerMaster;
import com.etour.app.repository.CustomerRepository;
import com.etour.app.email.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class ForgotPasswordController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        Optional<CustomerMaster> customerOpt = customerRepository.findByEmail(email);

        if (customerOpt.isEmpty()) {
            return ResponseEntity.ok("If an account exists with this email, a reset link has been sent.");
        }

        CustomerMaster customer = customerOpt.get();
        String token = UUID.randomUUID().toString();

        customer.setResetPasswordToken(token);
        customer.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(15));
        customerRepository.save(customer);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        System.out.println("DEBUG: Password Reset Link: " + resetLink);

        try {
            emailService.sendPasswordResetEmail(customer.getEmail(), resetLink);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to send email.");
        }

        return ResponseEntity.ok("If an account exists with this email, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        String newPassword = payload.get("newPassword");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Token and new password are required.");
        }

        Optional<CustomerMaster> customerOpt = customerRepository.findAll().stream()
                .filter(c -> token.equals(c.getResetPasswordToken()))
                .findFirst();

        if (customerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid token.");
        }

        CustomerMaster customer = customerOpt.get();

        if (customer.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Token has expired.");
        }

        customer.setPassword(passwordEncoder.encode(newPassword));
        customer.setResetPasswordToken(null);
        customer.setResetPasswordTokenExpiry(null);
        customerRepository.save(customer);

        return ResponseEntity.ok("Password reset successfully. You can now login.");
    }
}
