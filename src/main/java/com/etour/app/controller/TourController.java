package com.etour.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.etour.app.dto.TourDTO;
import com.etour.app.entity.TourMaster;
import com.etour.app.service.TourService;

@RestController
@RequestMapping("/api/tours")
public class TourController {
	@Autowired
	private TourService tourService;

	@GetMapping
	public List<TourMaster> getAllTours() {
		return tourService.getAllTours();
	}

	@GetMapping("/{id}")
	public TourMaster getTourById(@PathVariable int id) {
		return tourService.getTourById(id);
	}

	@PostMapping
	public TourMaster createTour(@RequestBody TourMaster tourMaster) {
		return tourService.addTour(tourMaster);
	}

	@DeleteMapping("/{id}")
	public String deleteTour(@PathVariable int id) {
		tourService.deleteTour(id);
		return "Tour Deleted Successfully";
	}

	@org.springframework.web.bind.annotation.PutMapping("/{id}")
	public TourMaster updateTour(@PathVariable int id, @RequestBody TourMaster tourMaster) {
		return tourService.updateTour(id, tourMaster);
	}

	@GetMapping("/details/{catmasterId}")
	public ResponseEntity<TourDTO> getTourDetails(
			@PathVariable int catmasterId) {

		return ResponseEntity.ok(
				tourService.getTourDetailsByCatmasterId(catmasterId));
	}

}
