package com.etour.app.service;

import java.util.List;

import com.etour.app.dto.CategoryClickResponseDTO;
import com.etour.app.entity.CategoryMaster;

public interface CategoryService {
	List<CategoryMaster> getMainCategories();

	CategoryClickResponseDTO handleCategoryClick(String categoryId);

	List<CategoryMaster> searchCategories(String query, Double minBudget, Double maxBudget, Integer minDays,
			Integer maxDays, java.time.LocalDate startDate, java.time.LocalDate endDate);

	List<CategoryMaster> getAllCategories();

	CategoryMaster saveCategory(CategoryMaster category);

	void deleteCategory(String categoryId);
}
