package com.etour.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.razorpay.RazorpayClient;

@Configuration
public class RazorpayConfig {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Bean
    public RazorpayClient razorpayClient() throws Exception {
        // ✨ Validate credentials are configured
        if (keyId == null || keyId.trim().isEmpty()) {
            throw new RuntimeException("Razorpay Key ID not configured. Set razorpay.key.id in application-local.properties");
        }
        if (keySecret == null || keySecret.trim().isEmpty()) {
            throw new RuntimeException("Razorpay Key Secret not configured. Set razorpay.key.secret in application-local.properties");
        }

        try {
            System.out.println("INFO: Initializing Razorpay client with Key ID: " + keyId.substring(0, Math.min(10, keyId.length())) + "...");
            RazorpayClient client = new RazorpayClient(keyId, keySecret);
            System.out.println("INFO: Razorpay client initialized successfully");
            return client;
        } catch (Exception e) {
            System.out.println("ERROR: Failed to initialize Razorpay client: " + e.getMessage());
            throw new RuntimeException("Failed to initialize Razorpay client. Check your Razorpay credentials in application-local.properties", e);
        }
    }
}
