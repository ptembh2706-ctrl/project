package com.etour.app.service.impl;

import com.etour.app.entity.CostMaster;
import com.etour.app.repository.CostRepository;

import com.etour.app.service.CostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import com.etour.app.dto.CostDTO;

@Service
public class CostServiceImpl implements CostService {
	@Autowired
	private CostRepository costRepository;

	@Autowired
	private com.etour.app.repository.CategoryRepository categoryRepository;

	@Override
	public CostMaster saveCost(CostMaster cost) {
		if (cost.getCatmaster() != null && cost.getCatmaster().getCategoryId() != null) {
			categoryRepository.findByCategoryId(cost.getCatmaster().getCategoryId())
					.ifPresent(cost::setCatmaster);
		}
		return costRepository.save(cost);
	}

	@Override
	public List<CostMaster> getAllCosts() {
		// TODO Auto-generated method stub
		return costRepository.findAll();
	}

	@Override
	public Optional<CostMaster> getCostById(int id) {
		// TODO Auto-generated method stub
		return costRepository.findById(id);
	}

	@Override
	public void deleteCost(int id) {
		// TODO Auto-generated method stub
		costRepository.deleteById(id);

	}

	@Override
	public List<CostDTO> getCostsByCatmasterId(Integer catmasterId) {

		List<CostMaster> costs = costRepository.findByCatmaster_Id(catmasterId);

		return costs.stream().map(c -> {
			CostDTO dto = new CostDTO();
			dto.setBaseCost(c.getBaseCost());
			dto.setSinglePersonCost(c.getSinglePersonCost());
			dto.setExtraPersonCost(c.getExtraPersonCost());
			dto.setChildWithBedCost(c.getChildWithBedCost());
			dto.setChildWithoutBedCost(c.getChildWithoutBedCost());
			dto.setValidFromDate(c.getValidFromDate());
			dto.setValidToDate(c.getValidToDate());
			return dto;
		}).toList();
	}

}
