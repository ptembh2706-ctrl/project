package com.etour.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.etour.app.entity.ItineraryMaster;

@Repository
public interface ItinerarryRepository extends JpaRepository<ItineraryMaster, Integer>{

	
	List<ItineraryMaster> findByCatmaster_IdOrderByDayNumberAsc(Integer catmasterId);

}
