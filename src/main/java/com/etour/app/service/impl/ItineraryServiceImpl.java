package com.etour.app.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.etour.app.entity.ItineraryMaster;
import com.etour.app.dto.ItineraryResponseDTO;
import com.etour.app.repository.ItinerarryRepository;
import com.etour.app.service.ItineraryService;

@Service
public class ItineraryServiceImpl implements ItineraryService {

	@Autowired
	private ItinerarryRepository itinerarryRepository;

	@Autowired
	private com.etour.app.repository.CategoryRepository categoryRepository;

	@Override
	public ItineraryMaster saveItinerary(ItineraryMaster itinerary) {
		if (itinerary.getCatmaster() != null && itinerary.getCatmaster().getCategoryId() != null) {
			categoryRepository.findByCategoryId(itinerary.getCatmaster().getCategoryId())
					.ifPresent(itinerary::setCatmaster);
		}
		return itinerarryRepository.save(itinerary);
	}

	@Override
	public void deleteItinerary(Integer id) {
		itinerarryRepository.deleteById(id);
	}

	@Override
	public List<ItineraryMaster> getAllItineraries() {
		// TODO Auto-generated method stub
		return itinerarryRepository.findAll();
	}

	@Override
	public ItineraryMaster getItineraryById(Integer id) {
		// TODO Auto-generated method stub
		return itinerarryRepository.findById(id).orElse(null);
	}

	@Override
	public List<ItineraryResponseDTO> getItinerariesByCatmasterId(Integer catmasterId) {
		// TODO Auto-generated method stub
		List<ItineraryMaster> itineraries = itinerarryRepository.findByCatmaster_IdOrderByDayNumberAsc(catmasterId);

		return itineraries.stream().map(itinerary -> {
			ItineraryResponseDTO dto = new ItineraryResponseDTO();
			dto.setDayNumber(itinerary.getDayNumber());
			dto.setItineraryDetails(itinerary.getItineraryDetails());
			dto.setCategoryId(itinerary.getCatmaster().getCategoryId());

			return dto;
		}).toList();
	}

}
