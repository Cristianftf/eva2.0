package com.backendeva.backend.controller;

import com.backendeva.backend.dto.EstadisticasDto;
import com.backendeva.backend.services.EstadisticasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/estadisticas")
public class EstadisticasController {

    @Autowired
    private EstadisticasService estadisticasService;

    @GetMapping("/generales")
    public EstadisticasDto getEstadisticasGenerales() {
        return estadisticasService.getEstadisticasGenerales();
    }
}
