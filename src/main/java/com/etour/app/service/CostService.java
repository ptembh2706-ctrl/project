package com.etour.app.service;

import com.etour.app.entity.CostMaster;
import java.util.List;
import java.util.Optional;
import com.etour.app.dto.CostDTO;

public interface CostService {
    List<CostMaster> getAllCosts();

    Optional<CostMaster> getCostById(int id);

    void deleteCost(int id);

    List<CostDTO> getCostsByCatmasterId(Integer catmasterId);

    CostMaster saveCost(CostMaster cost);
}