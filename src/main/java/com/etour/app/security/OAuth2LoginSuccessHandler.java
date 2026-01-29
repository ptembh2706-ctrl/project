package com.etour.app.security;

import com.etour.app.entity.CustomerMaster;
import com.etour.app.repository.CustomerRepository;
import com.etour.app.util.JwtUtils;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.UUID;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        Optional<CustomerMaster> customerOptional = customerRepository.findByEmail(email);
        CustomerMaster customer;

        if (customerOptional.isPresent()) {
            customer = customerOptional.get();
            // Optional: Update name from Google if it has changed?
            if (name != null && !name.equals(customer.getName())) {
                customer.setName(name);
                customerRepository.save(customer);
            }
        } else {
            // Register new user
            customer = new CustomerMaster();
            customer.setEmail(email);
            customer.setName(name != null ? name : "Google User");
            customer.setPassword(UUID.randomUUID().toString()); // Random dummy password

            // Set required defaults for non-nullable fields
            customer.setAddress("Not provided");
            customer.setCity("Not provided");
            customer.setState("Not provided");
            customer.setMobileNumber("0000000000"); // Dummy mobile

            customerRepository.save(customer);
        }

        // Generate JWT using JwtUtils with custom claims
        java.util.Map<String, Object> claims = new java.util.HashMap<>();
        claims.put("userId", customer.getId());
        claims.put("name", customer.getName());
        claims.put("firstName", customer.getName() != null ? customer.getName().split(" ")[0] : "User");

        String token = jwtUtils.generateToken(customer.getEmail(), claims);

        // Redirect to Frontend with Token
        String redirectUrl = "http://localhost:5173/login?token="
                + URLEncoder.encode(token, StandardCharsets.UTF_8.toString());
        response.sendRedirect(redirectUrl);
    }
}
