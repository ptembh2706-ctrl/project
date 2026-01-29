package com.etour.app.repository;

import com.etour.app.entity.CostMaster;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CostRepository extends JpaRepository<CostMaster, Integer> {
    List<CostMaster> findByCatmaster_Id(Integer catmasterId);
}