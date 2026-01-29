package com.etour.app.service;

import com.etour.app.dto.DestinationDTO;
import com.etour.app.dto.DestinationDTO.ReviewDTO;
import com.etour.app.entity.CategoryMaster;
import com.etour.app.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<DestinationDTO> getAllDestinations() {
        List<CategoryMaster> categories = categoryRepository.findAll();
        return categories.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public DestinationDTO getDestinationByName(String name) {
        // In a real app, we would query the repository by name
        // categoryRepository.findByName(name)
        return getAllDestinations().stream()
                .filter(d -> d.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElse(null);
    }

    private DestinationDTO convertToDTO(CategoryMaster category) {
        DestinationDTO dto = new DestinationDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());

        // Placeholder data for UI demo (fields not in DB yet)
        dto.setBestTimeToVisit("Oct - Mar");
        dto.setTemperature("20°C - 30°C");

        List<String> features = new ArrayList<>();
        features.add("Cultural Sites");
        features.add("Hotels");
        features.add("Transport");
        dto.setFeatures(features);

        List<ReviewDTO> reviews = new ArrayList<>();
        ReviewDTO r1 = new ReviewDTO();
        r1.setName("Happy Traveler");
        r1.setRating(5);
        r1.setComment("Amazing experience visiting " + category.getName() + "!");

        ReviewDTO r2 = new ReviewDTO();
        r2.setName("Tour Guide");
        r2.setRating(4);
        r2.setComment("Great infrastructure and views.");

        reviews.add(r1);
        reviews.add(r2);

        dto.setReviews(reviews);
        return dto;
    }
}