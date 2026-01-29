package com.etour.app.controller;

import com.etour.app.dto.DashboardStatsDTO;
import com.etour.app.repository.CategoryRepository;
import com.etour.app.repository.CustomerRepository;
import com.etour.app.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalCategories(categoryRepository.count());
        stats.setTotalTours(tourRepository.count());
        stats.setTotalCustomers(customerRepository.count());
        return ResponseEntity.ok(stats);
    }
}
