package com.etour.app.invoice.dto;

import java.math.BigDecimal;

public class InvoicePassengerDTO {

    private String passengerName;
    private String passengerType;
    private BigDecimal passengerAmount;

    public InvoicePassengerDTO() {}

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
