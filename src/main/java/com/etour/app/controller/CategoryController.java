package com.etour.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.etour.app.dto.CategoryClickResponseDTO;
import com.etour.app.entity.CategoryMaster;
import com.etour.app.service.CategoryService;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
	@Autowired
	private CategoryService categoryService;

	@GetMapping
	public ResponseEntity<List<CategoryMaster>> getMainCategories() {
		return ResponseEntity.ok(categoryService.getMainCategories());
	}

	@GetMapping("/{categoryId}")
	public ResponseEntity<CategoryClickResponseDTO> handleCategoryClick(@PathVariable String categoryId) {
		return ResponseEntity.ok(categoryService.handleCategoryClick(categoryId));
	}

	@GetMapping("/search")
	public ResponseEntity<List<CategoryMaster>> searchCategories(
			@RequestParam(required = false) String query,
			@RequestParam(required = false) Double minBudget,
			@RequestParam(required = false) Double maxBudget,
			@RequestParam(required = false) Integer minDays,
			@RequestParam(required = false) Integer maxDays,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

		return ResponseEntity.ok(
				categoryService.searchCategories(query, minBudget, maxBudget, minDays, maxDays, startDate, endDate));
	}

	@GetMapping("/all")
	public ResponseEntity<List<CategoryMaster>> getAllCategories() {
		return ResponseEntity.ok(categoryService.getAllCategories());
	}

	@PostMapping
	public ResponseEntity<CategoryMaster> createCategory(@RequestBody CategoryMaster category) {
		return ResponseEntity.ok(categoryService.saveCategory(category));
	}

	@PutMapping("/{categoryId}")
	public ResponseEntity<CategoryMaster> updateCategory(@PathVariable String categoryId,
			@RequestBody CategoryMaster category) {
		category.setCategoryId(categoryId);
		return ResponseEntity.ok(categoryService.saveCategory(category));
	}

	@DeleteMapping("/{categoryId}")
	public ResponseEntity<String> deleteCategory(@PathVariable String categoryId) {
		categoryService.deleteCategory(categoryId);
		return ResponseEntity.ok("Category deleted successfully");
	}
}
