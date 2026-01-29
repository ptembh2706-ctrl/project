package com.etour.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.etour.app.config.CustomUserDetails;
import com.etour.app.dto.AuthRequest;
import com.etour.app.dto.AuthResponse;
import com.etour.app.entity.CustomerMaster;
import com.etour.app.repository.CustomerRepository;
import com.etour.app.util.JwtUtils;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody CustomerMaster customer) {
        if (customerRepository.findByEmail(customer.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use!");
        }

        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        CustomerMaster savedCustomer = customerRepository.save(customer);

        java.util.Map<String, Object> claims = new java.util.HashMap<>();
        claims.put("userId", savedCustomer.getId());
        claims.put("name", savedCustomer.getName());
        claims.put("firstName", savedCustomer.getName() != null ? savedCustomer.getName().split(" ")[0] : "User");
        claims.put("role", savedCustomer.getRole());

        String token = jwtUtils.generateToken(savedCustomer.getEmail(), claims);

        return ResponseEntity.ok(new AuthResponse(
                token,
                savedCustomer.getId(),
                savedCustomer.getName(),
                savedCustomer.getEmail(),
                savedCustomer.getRole()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        java.util.Map<String, Object> claims = new java.util.HashMap<>();
        claims.put("userId", userDetails.getCustomer().getId());
        claims.put("name", userDetails.getCustomer().getName());
        claims.put("firstName",
                userDetails.getCustomer().getName() != null ? userDetails.getCustomer().getName().split(" ")[0]
                        : "User");
        claims.put("role", userDetails.getCustomer().getRole());

        String token = jwtUtils.generateToken(userDetails.getUsername(), claims);

        return ResponseEntity.ok(new AuthResponse(
                token,
                userDetails.getCustomer().getId(),
                userDetails.getCustomer().getName(),
                userDetails.getCustomer().getEmail(),
                userDetails.getCustomer().getRole()));
    }
}
