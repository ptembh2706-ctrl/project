package com.etour.app.controller;

import com.etour.app.dto.CustomerDTO;
import com.etour.app.entity.CustomerMaster;
import com.etour.app.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping("/register")
    public ResponseEntity<CustomerDTO> registerCustomer(@RequestBody CustomerMaster customer) {
        CustomerMaster savedCustomer = customerService.registerCustomer(customer);
        return new ResponseEntity<>(new CustomerDTO(savedCustomer), HttpStatus.CREATED);
    }

    @GetMapping
    public List<CustomerDTO> getAllCustomers() {
        return customerService.getAllCustomers()
                .stream()
                .map(CustomerDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable Integer id) {
        try {
            CustomerMaster customer = customerService.getCustomerById(id);
            return new ResponseEntity<>(new CustomerDTO(customer), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable Integer id, @RequestBody CustomerMaster customer) {
        try {
            CustomerMaster updatedCustomer = customerService.updateCustomer(id, customer);
            return new ResponseEntity<>(new CustomerDTO(updatedCustomer), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Integer id) {
        try {
            customerService.deleteCustomer(id);
            return new ResponseEntity<>("Customer deleted successfully", HttpStatus.OK);
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>(
                    "Cannot delete customer. Customer has associated bookings or data.",
                    HttpStatus.CONFLICT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Customer not found with ID: " + id, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "Error deleting customer: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginCustomer(@RequestBody CustomerMaster loginDetails) {
        CustomerMaster customer = customerService.loginCustomer(loginDetails.getEmail(), loginDetails.getPassword());
        if (customer != null) {
            // Return DTO to exclude password from response
            return new ResponseEntity<>(new CustomerDTO(customer), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/uploadData")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            List<CustomerMaster> list = customerService.parseExcel(file);
            List<CustomerDTO> dtos = list.stream().map(CustomerDTO::new).collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}