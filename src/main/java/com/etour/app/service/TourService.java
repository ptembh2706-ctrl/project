package com.etour.app.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.etour.app.dto.SearchResultDTO;
import com.etour.app.dto.TourDTO;
import com.etour.app.entity.TourMaster;

public interface TourService {
    List<TourMaster> getAllTours();

    TourMaster getTourById(int id);

    TourMaster addTour(TourMaster tourMaster);

    void deleteTour(int id);

    TourDTO getTourDetailsByCatmasterId(int catmasterId);

    List<SearchResultDTO> searchToursByDate(LocalDate from, LocalDate to);

    List<SearchResultDTO> searchToursByDuration(Integer min, Integer max);

    List<SearchResultDTO> searchToursByCost(BigDecimal min, BigDecimal max);

    TourMaster updateTour(int id, TourMaster tourMaster);
}