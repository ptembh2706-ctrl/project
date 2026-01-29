package com.etour.app.controller;

import com.etour.app.entity.CostMaster;
// Make sure this import points to your actual Interface
import com.etour.app.service.CostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import com.etour.app.dto.CostDTO;

@RestController
@RequestMapping("/api/costs")
public class CostController {

    @Autowired
    private CostService costService;

    // 1. Get All Costs
    @GetMapping
    public List<CostMaster> getAllCosts() {
        return costService.getAllCosts();
    }

    // 2. Get Cost By ID
    @GetMapping("/{id}")
    public ResponseEntity<CostMaster> getCostById(@PathVariable int id) {
        Optional<CostMaster> cost = costService.getCostById(id);

        // Java 8+ style: if present return OK, else return Not Found
        return cost.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 3. Delete Cost
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCost(@PathVariable int id) {
        costService.deleteCost(id);
        return ResponseEntity.ok("Cost deleted successfully");
    }

    @PostMapping
    public ResponseEntity<CostMaster> createCost(@RequestBody CostMaster cost) {
        return ResponseEntity.ok(costService.saveCost(cost));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CostMaster> updateCost(@PathVariable int id, @RequestBody CostMaster cost) {
        cost.setId(id);
        return ResponseEntity.ok(costService.saveCost(cost));
    }

    @GetMapping("/category/{catmasterId}")
    public ResponseEntity<List<CostDTO>> getCostsByCategory(
            @PathVariable Integer catmasterId) {

        return ResponseEntity.ok(
                costService.getCostsByCatmasterId(catmasterId));
    }
}