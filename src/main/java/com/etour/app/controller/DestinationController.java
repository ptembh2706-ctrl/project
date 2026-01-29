package com.etour.app.controller;

import com.etour.app.dto.DestinationDTO;
import com.etour.app.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    @GetMapping
    public List<DestinationDTO> getAllDestinations() {
        return destinationService.getAllDestinations();
    }

    @GetMapping("/{name}")
    public DestinationDTO getDestinationByName(@PathVariable String name) {
        return destinationService.getDestinationByName(name);
    }
}