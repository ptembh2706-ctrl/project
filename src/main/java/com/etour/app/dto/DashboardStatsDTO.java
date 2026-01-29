package com.etour.app.dto;

public class DashboardStatsDTO {
    private long totalCategories;
    private long totalTours;
    private long totalCustomers;

    public long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public long getTotalTours() {
        return totalTours;
    }

    public void setTotalTours(long totalTours) {
        this.totalTours = totalTours;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }
}
