package com.etour.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.etour.app.entity.ItineraryMaster;
import com.etour.app.dto.ItineraryResponseDTO;
import com.etour.app.service.ItineraryService;

@RestController
@RequestMapping("/api/itineraries")
public class ItineraryController {

    @Autowired
    private ItineraryService itineraryService;

    @GetMapping
    public List<ItineraryMaster> getAllItineraries() {
        return itineraryService.getAllItineraries();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItineraryMaster> getItineraryById(
            @PathVariable Integer id) {
        return ResponseEntity.ok(itineraryService.getItineraryById(id));
    }

    // @GetMapping("/category/{catmasterId}")
    // public ResponseEntity<List<ItineraryMaster>> getByCategory(
    // @PathVariable Integer catmasterId) {
    //
    // return ResponseEntity.ok(
    // itineraryService.getItineraryByCategory(catmasterId));
    // }

    @GetMapping("/category/{catmasterId}")
    public ResponseEntity<List<ItineraryResponseDTO>> getItinerariesByCatmasterId(@PathVariable Integer catmasterId) {
        List<ItineraryResponseDTO> itineraries = itineraryService.getItinerariesByCatmasterId(catmasterId);

        return ResponseEntity.ok(itineraries);
    }

    @org.springframework.web.bind.annotation.PostMapping
    public ResponseEntity<ItineraryMaster> createItinerary(@RequestBody ItineraryMaster itinerary) {
        return ResponseEntity.ok(itineraryService.saveItinerary(itinerary));
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    public ResponseEntity<ItineraryMaster> updateItinerary(@PathVariable Integer id,
            @RequestBody ItineraryMaster itinerary) {
        itinerary.setId(id);
        return ResponseEntity.ok(itineraryService.saveItinerary(itinerary));
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItinerary(@PathVariable Integer id) {
        itineraryService.deleteItinerary(id);
        return ResponseEntity.ok("Itinerary deleted successfully");
    }
}
