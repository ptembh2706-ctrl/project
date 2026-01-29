package com.etour.app.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.etour.app.entity.DepartureDateMaster;
import com.etour.app.repository.DepartureDateRepository;
import com.etour.app.service.DepartureService;
import com.etour.app.dto.DepartureDateDTO;

@Service
public class DepartureDateImpl implements DepartureService {

    @Autowired
    private DepartureDateRepository repo;

    @Override
    public DepartureDateMaster addDepartureDate(DepartureDateMaster departure) {
        return repo.save(departure);
    }

    @Override
    public DepartureDateMaster updateDeparture(DepartureDateMaster departure) {
        return repo.save(departure);
    }

    @Override
    public List<DepartureDateMaster> getAllDepartures() {
        return repo.findAll();
    }

    @Override
    public DepartureDateMaster getDepartureById(int departureDateId) {
        return repo.findById(departureDateId).orElse(null);
    }

    @Override
    public void deleteDepartureDate(Integer departureDateId) {
        repo.deleteById(departureDateId);
    }

    @Override
    public List<DepartureDateDTO> getDepartureDatesByCatmasterId(Integer catmasterId) {
        List<DepartureDateMaster> dates = repo.findByCatmaster_Id(catmasterId);

        return dates.stream().map(date -> {
            DepartureDateDTO dto = new DepartureDateDTO();
            dto.setId(date.getId());
            dto.setDepartureDate(date.getDepartureDate());
            dto.setEndDate(date.getEndDate());
            dto.setNumberOfDays(date.getNumberOfDays());
            return dto;
        }).toList();
    }

    @Override
    public List<DepartureDateMaster> getUpcomingDepartures() {
        return repo.findByDepartureDateGreaterThanEqual(LocalDate.now());
    }

    @Override
    public List<DepartureDateMaster> getDeparturesBetween(LocalDate startDate, LocalDate endDate) {
        return repo.findByDepartureDateBetween(startDate, endDate);
    }
}
 