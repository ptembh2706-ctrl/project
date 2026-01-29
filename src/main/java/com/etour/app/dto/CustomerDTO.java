package com.etour.app.dto;

public class CustomerDTO {
    private Integer customerId;
    private String name;
    private String email;
    private String mobileNumber;
    private String address;
    private String city;
    private String state;
    private String password;

    public CustomerDTO() {
    }

    public CustomerDTO(Integer customerId, String name, String email, String mobileNumber, String address, String city,
            String state) {
        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.address = address;
        this.city = city;
        this.state = state;
    }

    // Constructor accepting CustomerMaster
    public CustomerDTO(com.etour.app.entity.CustomerMaster customer) {
        this.customerId = customer.getId();
        this.name = customer.getName();
        this.email = customer.getEmail();
        this.mobileNumber = customer.getMobileNumber();
        this.address = customer.getAddress();
        this.city = customer.getCity();
        this.state = customer.getState();
    }

    // Getters and Setters
    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
