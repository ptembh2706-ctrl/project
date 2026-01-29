package com.etour.app.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cost_master")
public class CostMaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cost_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "catmaster_id", nullable = false)
    private CategoryMaster catmaster;

    @Column(name = "base_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal baseCost;

    @Column(name = "single_person_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal singlePersonCost;

    @Column(name = "extra_person_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal extraPersonCost;

    @Column(name = "child_with_bed_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal childWithBedCost;

    @Column(name = "child_without_bed_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal childWithoutBedCost;

    @Column(name = "valid_from_date", nullable = false)
    private LocalDate validFromDate;

    @Column(name = "valid_to_date", nullable = false)
    private LocalDate validToDate;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public CategoryMaster getCatmaster() {
        return catmaster;
    }

    public void setCatmaster(CategoryMaster catmaster) {
        this.catmaster = catmaster;
    }

    public BigDecimal getBaseCost() {
        return baseCost;
    }

    public void setBaseCost(BigDecimal baseCost) {
        this.baseCost = baseCost;
    }

    public BigDecimal getSinglePersonCost() {
        return singlePersonCost;
    }

    public void setSinglePersonCost(BigDecimal singlePersonCost) {
        this.singlePersonCost = singlePersonCost;
    }

    public BigDecimal getExtraPersonCost() {
        return extraPersonCost;
    }

    public void setExtraPersonCost(BigDecimal extraPersonCost) {
        this.extraPersonCost = extraPersonCost;
    }

    public BigDecimal getChildWithBedCost() {
        return childWithBedCost;
    }

    public void setChildWithBedCost(BigDecimal childWithBedCost) {
        this.childWithBedCost = childWithBedCost;
    }

    public BigDecimal getChildWithoutBedCost() {
        return childWithoutBedCost;
    }

    public void setChildWithoutBedCost(BigDecimal childWithoutBedCost) {
        this.childWithoutBedCost = childWithoutBedCost;
    }

    public LocalDate getValidFromDate() {
        return validFromDate;
    }

    public void setValidFromDate(LocalDate validFromDate) {
        this.validFromDate = validFromDate;
    }

    public LocalDate getValidToDate() {
        return validToDate;
    }

    public void setValidToDate(LocalDate validToDate) {
        this.validToDate = validToDate;
    }

}