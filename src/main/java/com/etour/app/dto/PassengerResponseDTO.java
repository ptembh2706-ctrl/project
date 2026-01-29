package com.etour.app.dto;

import java.math.BigDecimal;

public class PassengerResponseDTO {

    private Integer passengerId;        
    private String passengerName;
    private String passengerType;
    private BigDecimal passengerAmount;

    public Integer getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(Integer passengerId) {
        this.passengerId = passengerId;
    }
    
    public String getPassengerName() {
        return passengerName;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public String getPassengerType() {
        return passengerType;
    }

    public void setPassengerType(String passengerType) {
        this.passengerType = passengerType;
    }

    public BigDecimal getPassengerAmount() {
        return passengerAmount;
    }

    public void setPassengerAmount(BigDecimal passengerAmount) {
        this.passengerAmount = passengerAmount;
    }
}
