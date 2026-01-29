package com.etour.app.service.impl;

import com.etour.app.entity.CustomerMaster;
import com.etour.app.repository.CustomerRepository;
import com.etour.app.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Iterator;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public CustomerMaster registerCustomer(CustomerMaster customer) {
        if (customerRepository.existsByEmail(customer.getEmail())) {
            throw new RuntimeException("Email already registered: " + customer.getEmail());
        }
        // Hash the password before saving
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        return customerRepository.save(customer);
    }

    @Override
    public List<CustomerMaster> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public CustomerMaster getCustomerById(Integer id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));
    }

    @Override
    @Transactional
    public CustomerMaster updateCustomer(Integer id, CustomerMaster customerDetails) {
        CustomerMaster existingCustomer = getCustomerById(id);

        existingCustomer.setName(customerDetails.getName());
        existingCustomer.setMobileNumber(customerDetails.getMobileNumber());
        existingCustomer.setAddress(customerDetails.getAddress());
        existingCustomer.setCity(customerDetails.getCity());
        existingCustomer.setState(customerDetails.getState());

        // Hash the new password if provided
        if (customerDetails.getPassword() != null && !customerDetails.getPassword().isEmpty()) {
            existingCustomer.setPassword(passwordEncoder.encode(customerDetails.getPassword()));
        }
        return customerRepository.save(existingCustomer);
    }

    @Override
    @Transactional
    public void deleteCustomer(Integer id) {
        CustomerMaster customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));

        customerRepository.delete(customer);
    }

    @Override
    public CustomerMaster loginCustomer(String email, String password) {
        Optional<CustomerMaster> customerOpt = customerRepository.findByEmail(email);
        if (customerOpt.isPresent()) {
            CustomerMaster customer = customerOpt.get();
            // Fix NPE: Check if stored password is not null and matches using BCrypt
            if (customer.getPassword() != null && passwordEncoder.matches(password, customer.getPassword())) {
                return customer;
            }
        }
        return null;
    }

    @Override
    public List<CustomerMaster> parseExcel(MultipartFile file) {
        List<CustomerMaster> list = new ArrayList<>();
        try {
            Workbook workbook = new XSSFWorkbook(file.getInputStream());
            Sheet sheet = workbook.getSheetAt(0);

            Iterator<Row> rows = sheet.iterator();
            if (rows.hasNext())
                rows.next(); // Skip header row

            while (rows.hasNext()) {
                Row row = rows.next();
                CustomerMaster cm = new CustomerMaster();
                cm.setName(getString(row.getCell(0)));
                cm.setEmail(getString(row.getCell(1)));
                cm.setMobileNumber(getString(row.getCell(2)));

                String rawPwd = getString(row.getCell(3));
                if (!rawPwd.isEmpty()) {
                    cm.setPassword(passwordEncoder.encode(rawPwd));
                }

                cm.setAddress(getString(row.getCell(4)));
                cm.setCity(getString(row.getCell(5)));
                cm.setState(getString(row.getCell(6)));

                list.add(cm);
            }
            workbook.close();
            customerRepository.saveAll(list);
        } catch (Exception ee) {
            ee.printStackTrace();
            throw new RuntimeException("Fail to parse Excel file: " + ee.getMessage());
        }
        return list;
    }

    private String getString(Cell cell) {
        if (cell == null)
            return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case BLANK:
                return "";
            default:
                return "";
        }
    }
}