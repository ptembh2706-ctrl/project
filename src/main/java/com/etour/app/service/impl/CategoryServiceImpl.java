package com.etour.app.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.etour.app.dto.CategoryClickResponseDTO;
import com.etour.app.entity.CategoryMaster;
import com.etour.app.repository.CategoryRepository;
import com.etour.app.service.CategoryService;
import com.etour.app.service.TourService;

@Service
public class CategoryServiceImpl implements CategoryService {

	@Autowired
	private CategoryRepository categoryRepository;

	@Autowired
	private TourService tourService;

	@Override
	public List<CategoryMaster> getMainCategories() {
		return categoryRepository.findAllBySubcategoryIdIsNull();
	}

	@Override
	public CategoryClickResponseDTO handleCategoryClick(String categoryId) {
		CategoryMaster category = categoryRepository
				.findByCategoryId(categoryId)
				.orElseThrow(() -> new RuntimeException("Category not found"));

		boolean flag = Boolean.TRUE.equals(category.getFlag()); // flag=1 => leaf => tour details

		CategoryClickResponseDTO resp = new CategoryClickResponseDTO();

		if (!flag) {
			resp.setResponseType("SUBCATEGORIES");
			resp.setSubcategories(categoryRepository.findAllBySubcategoryId(category.getCategoryId()));
			resp.setTour(null);
			return resp;
		}

		resp.setResponseType("TOUR");
		resp.setSubcategories(null);
		resp.setTour(tourService.getTourDetailsByCatmasterId(category.getId()));
		return resp;

	}

	@Override
	public List<CategoryMaster> searchCategories(String query, Double minBudget, Double maxBudget, Integer minDays,
			Integer maxDays, java.time.LocalDate startDate, java.time.LocalDate endDate) {
		// Handle empty or null query
		if (query != null && query.trim().isEmpty())
			query = null;

		return categoryRepository.findBySearchCriteria(query, minBudget, maxBudget, minDays, maxDays, startDate,
				endDate);
	}

	@Override
	public List<CategoryMaster> getAllCategories() {
		return categoryRepository.findAll();
	}

	@Override
	public CategoryMaster saveCategory(CategoryMaster category) {
		if (category.getId() == null && category.getCategoryId() != null) {
			categoryRepository.findByCategoryId(category.getCategoryId()).ifPresent(existing -> {
				category.setId(existing.getId());
			});
		}
		return categoryRepository.save(category);
	}

	@Override
	public void deleteCategory(String categoryId) {
		CategoryMaster cat = categoryRepository.findByCategoryId(categoryId)
				.orElseThrow(() -> new RuntimeException("Category not found"));
		categoryRepository.delete(cat);
	}

}
