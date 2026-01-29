package com.etour.app.service;

import java.time.LocalDate;
import java.util.List;

import com.etour.app.entity.DepartureDateMaster;
import com.etour.app.dto.DepartureDateDTO;

public interface DepartureService {

    DepartureDateMaster addDepartureDate(DepartureDateMaster departure);

    DepartureDateMaster updateDeparture(DepartureDateMaster departure);

    List<DepartureDateMaster> getAllDepartures();

    DepartureDateMaster getDepartureById(int departureDateId);

    void deleteDepartureDate(Integer departureDateId);

    List<DepartureDateDTO> getDepartureDatesByCatmasterId(Integer catmasterId);

    List<DepartureDateMaster> getUpcomingDepartures();

    List<DepartureDateMaster> getDeparturesBetween(LocalDate startDate, LocalDate endDate);
}
