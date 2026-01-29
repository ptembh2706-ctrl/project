package com.etour.app.repository;

import com.etour.app.entity.CustomerMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerMaster, Integer> {
    
    // Custom method to find a customer by email (useful for login or duplicate checks)
    Optional<CustomerMaster> findByEmail(String email);
    
    // Custom method to check if an email already exists
    boolean existsByEmail(String email);
}