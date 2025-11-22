package com.backendeva.backend.controller;

import com.backendeva.backend.dto.EstadisticasDto;
import com.backendeva.backend.services.EstadisticasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/estadisticas")
@CrossOrigin(origins = "*")
public class EstadisticasController {

    @Autowired
    private EstadisticasService estadisticasService;

    @GetMapping("/generales")
    public EstadisticasDto getEstadisticasGenerales() {
        return estadisticasService.getEstadisticasGenerales();
    }

    @GetMapping("/profesor/{profesorId}")
    public EstadisticasDto getEstadisticasProfesor(@PathVariable Long profesorId) {
        return estadisticasService.getEstadisticasProfesor(profesorId);
    }

    @GetMapping("/estudiante/{estudianteId}")
    public EstadisticasDto getEstadisticasEstudiante(@PathVariable Long estudianteId) {
        return estadisticasService.getEstadisticasEstudiante(estudianteId);
    }
}
