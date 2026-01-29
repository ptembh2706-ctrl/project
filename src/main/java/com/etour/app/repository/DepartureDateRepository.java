package com.etour.app.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.etour.app.entity.DepartureDateMaster;

public interface DepartureDateRepository extends JpaRepository<DepartureDateMaster, Integer> {

    List<DepartureDateMaster> findByCatmaster_Id(int catmasterId);

    List<DepartureDateMaster> findByDepartureDateGreaterThanEqual(LocalDate date);

    List<DepartureDateMaster> findByDepartureDateBetween(LocalDate startDate, LocalDate endDate);
    
   
}
