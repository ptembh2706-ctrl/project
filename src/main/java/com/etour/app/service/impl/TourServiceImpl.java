package com.etour.app.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.etour.app.dto.CostDTO;
import com.etour.app.dto.DepartureDateDTO;
import com.etour.app.dto.ItineraryResponseDTO;
import com.etour.app.dto.SearchResultDTO;
import com.etour.app.dto.TourDTO;
import com.etour.app.entity.CategoryMaster;
import com.etour.app.entity.CostMaster;
import com.etour.app.entity.DepartureDateMaster;
import com.etour.app.entity.ItineraryMaster;
import com.etour.app.entity.TourMaster;
import com.etour.app.repository.CategoryRepository;
import com.etour.app.repository.TourRepository;
import com.etour.app.service.CostService;
import com.etour.app.service.ItineraryService;
import com.etour.app.service.TourService;
import com.etour.app.service.DepartureService;

@Service
public class TourServiceImpl implements TourService {

	@Autowired
	private TourRepository tourRepository;

	@Autowired
	private CategoryRepository categoryRepository;

	@Autowired
	private CostService costService;

	@Autowired
	private ItineraryService itineraryService;

	@Autowired
	private DepartureService departureService;

	@Override
	public List<TourMaster> getAllTours() {
		return tourRepository.findAll();
	}

	@Override
	public TourMaster getTourById(int id) {
		return tourRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Tour not found"));
	}

	@Override
	public TourMaster addTour(TourMaster tourMaster) {
		if (tourMaster.getCatmaster() != null && tourMaster.getCatmaster().getCategoryId() != null) {
			categoryRepository.findByCategoryId(tourMaster.getCatmaster().getCategoryId())
					.ifPresent(tourMaster::setCatmaster);
		}
		return tourRepository.save(tourMaster);
	}

	@Override
	public TourMaster updateTour(int id, TourMaster tourMaster) {
		tourMaster.setId(id);
		if (tourMaster.getCatmaster() != null && tourMaster.getCatmaster().getCategoryId() != null) {
			categoryRepository.findByCategoryId(tourMaster.getCatmaster().getCategoryId())
					.ifPresent(tourMaster::setCatmaster);
		}
		return tourRepository.save(tourMaster);
	}

	@Override
	public void deleteTour(int id) {
		tourRepository.deleteById(id);
	}

	@Override
	public TourDTO getTourDetailsByCatmasterId(int catmasterId) {
		CategoryMaster category = categoryRepository.findById(catmasterId)
				.orElseThrow(() -> new RuntimeException("Category not found"));

		TourDTO dto = new TourDTO();
		dto.setCatmasterId(catmasterId);
		dto.setTourName(category.getName());

		// description (if present in tour_master)
		tourRepository.findFirstByCatmaster_Id(catmasterId)
				.map(TourMaster::getDescription)
				.ifPresent(dto::setDescription);

		dto.setCosts(
				costService.getCostsByCatmasterId(catmasterId));

		// base cost
		List<CostDTO> costs = dto.getCosts();
		dto.setBaseCost(
				costs.isEmpty() ? BigDecimal.ZERO : costs.get(0).getBaseCost());

		List<DepartureDateDTO> dates = departureService.getDepartureDatesByCatmasterId(catmasterId);

		dto.setAvailableDates(dates);

		if (!dates.isEmpty()) {
			dto.setNumberOfDays(dates.get(0).getNumberOfDays());
		}

		List<ItineraryResponseDTO> itinerary = itineraryService.getItinerariesByCatmasterId(catmasterId);

		dto.setItinerary(itinerary);

		return dto;
	}

	@Override
	public List<SearchResultDTO> searchToursByDate(LocalDate from, LocalDate to) {
		return tourRepository.findToursByDateRange(from, to);
	}

	@Override
	public List<SearchResultDTO> searchToursByDuration(Integer min, Integer max) {
		return tourRepository.findToursByDuration(min, max);
	}

	@Override
	public List<SearchResultDTO> searchToursByCost(BigDecimal min, BigDecimal max) {
		return tourRepository.findToursByCost(min, max);
	}

}