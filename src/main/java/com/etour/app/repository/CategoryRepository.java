package com.etour.app.repository;

import com.etour.app.entity.CategoryMaster;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<CategoryMaster, Integer> {
	// Fetch main categories
	List<CategoryMaster> findAllBySubcategoryIdIsNull();

	Optional<CategoryMaster> findByCategoryId(String categoryId);

	boolean existsBySubcategoryId(String categoryId);

	// Fetch all Subcategories of a Category
	List<CategoryMaster> findAllBySubcategoryId(String categoryId);

	@org.springframework.data.jpa.repository.Query("SELECT DISTINCT c FROM CategoryMaster c " +
			"JOIN CostMaster cost ON cost.catmaster = c " +
			"JOIN DepartureDateMaster dept ON dept.catmaster = c " +
			"WHERE (:query IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%'))) " +
			"AND (:minBudget IS NULL OR cost.singlePersonCost >= :minBudget) " +
			"AND (:maxBudget IS NULL OR cost.singlePersonCost <= :maxBudget) " +
			"AND (:minDays IS NULL OR dept.numberOfDays >= :minDays) " +
			"AND (:maxDays IS NULL OR dept.numberOfDays <= :maxDays) " +
			"AND (cast(:startDate as date) IS NULL OR dept.departureDate >= :startDate) " +
			"AND (cast(:endDate as date) IS NULL OR dept.departureDate <= :endDate)")
	List<CategoryMaster> findBySearchCriteria(
			@org.springframework.data.repository.query.Param("query") String query,
			@org.springframework.data.repository.query.Param("minBudget") Double minBudget,
			@org.springframework.data.repository.query.Param("maxBudget") Double maxBudget,
			@org.springframework.data.repository.query.Param("minDays") Integer minDays,
			@org.springframework.data.repository.query.Param("maxDays") Integer maxDays,
			@org.springframework.data.repository.query.Param("startDate") java.time.LocalDate startDate,
			@org.springframework.data.repository.query.Param("endDate") java.time.LocalDate endDate);
}
