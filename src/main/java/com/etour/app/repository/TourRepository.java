package com.etour.app.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.etour.app.entity.TourMaster;
import com.etour.app.dto.SearchResultDTO;

public interface TourRepository extends JpaRepository<TourMaster, Integer> {
	Optional<TourMaster> findFirstByCatmaster_Id(Integer catmasterId);

	// Search tours by Date Range
	@Query("""
			    SELECT new com.etour.app.dto.SearchResultDTO(
			        t.id, t.catmaster.id, t.catmaster.name, d.departureDate, d.endDate, d.numberOfDays, c.baseCost, t.catmaster.imagePath
			    )
			    FROM TourMaster t
			    JOIN t.departureDate d
			    JOIN t.catmaster cat
			    JOIN CostMaster c ON c.catmaster = cat
			    WHERE d.departureDate BETWEEN :fromDate AND :toDate
			    AND d.departureDate BETWEEN c.validFromDate AND c.validToDate
			""")
	List<SearchResultDTO> findToursByDateRange(
			@Param("fromDate") LocalDate fromDate,
			@Param("toDate") LocalDate toDate);

	// Search tours by Duration
	@Query("""
			    SELECT new com.etour.app.dto.SearchResultDTO(
			        t.id, t.catmaster.id, t.catmaster.name, d.departureDate, d.endDate, d.numberOfDays, c.baseCost, t.catmaster.imagePath
			    )
			    FROM TourMaster t
			    JOIN t.departureDate d
			    JOIN t.catmaster cat
			    JOIN CostMaster c ON c.catmaster = cat
			    WHERE d.numberOfDays BETWEEN :minDays AND :maxDays
			    AND d.departureDate BETWEEN c.validFromDate AND c.validToDate
			""")
	List<SearchResultDTO> findToursByDuration(
			@Param("minDays") Integer minDays,
			@Param("maxDays") Integer maxDays);

	// Search tours by Cost Range
	@Query("""
			    SELECT new com.etour.app.dto.SearchResultDTO(
			        t.id, t.catmaster.id, t.catmaster.name, d.departureDate, d.endDate, d.numberOfDays, c.baseCost, t.catmaster.imagePath
			    )
			    FROM TourMaster t
			    JOIN t.departureDate d
			    JOIN t.catmaster cat
			    JOIN CostMaster c ON c.catmaster = cat
			    WHERE c.baseCost BETWEEN :minPrice AND :maxPrice
			    AND d.departureDate BETWEEN c.validFromDate AND c.validToDate
			""")
	List<SearchResultDTO> findToursByCost(
			@Param("minPrice") BigDecimal minPrice,
			@Param("maxPrice") BigDecimal maxPrice);
}