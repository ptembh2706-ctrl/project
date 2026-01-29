package com.etour.app.controller;

import com.etour.app.dto.SearchResultDTO;
import com.etour.app.service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {
    @Autowired
    private TourService tourService;

    // Search by Period (e.g., /api/search/period?from=2023-01-01&to=2023-01-31)
    @GetMapping("/period")
    public ResponseEntity<List<SearchResultDTO>> searchByPeriod(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(tourService.searchToursByDate(from, to));
    }

    // Search by Duration (e.g., /api/search/duration?min=3&max=7)
    @GetMapping("/duration")
    public ResponseEntity<List<SearchResultDTO>> searchByDuration(
            @RequestParam("min") Integer min,
            @RequestParam("max") Integer max) {
        return ResponseEntity.ok(tourService.searchToursByDuration(min, max));
    }

    // Search by Cost (e.g., /api/search/cost?min=1000&max=5000)
    @GetMapping("/cost")
    public ResponseEntity<List<SearchResultDTO>> searchByCost(
            @RequestParam("min") BigDecimal min,
            @RequestParam("max") BigDecimal max) {
        return ResponseEntity.ok(tourService.searchToursByCost(min, max));
    }
}
