package com.etour.app.service;

import java.util.List;

import com.etour.app.entity.ItineraryMaster;
import com.etour.app.dto.ItineraryResponseDTO;

public interface ItineraryService {

    ItineraryMaster saveItinerary(ItineraryMaster itinerary);

    List<ItineraryMaster> getAllItineraries();

    ItineraryMaster getItineraryById(Integer id);

    List<ItineraryResponseDTO> getItinerariesByCatmasterId(Integer catmasterId);

    void deleteItinerary(Integer id);
}
