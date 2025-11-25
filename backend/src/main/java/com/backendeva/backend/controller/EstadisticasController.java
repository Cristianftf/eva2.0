package com.backendeva.backend.controller;

import com.backendeva.backend.dto.ActividadRecienteDto;
import com.backendeva.backend.dto.EstadisticasDto;
import com.backendeva.backend.dto.EstadisticasProfesorDto;
import com.backendeva.backend.dto.EstadisticasEstudianteDto;
import com.backendeva.backend.services.EstadisticasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estadisticas")
public class EstadisticasController {

    @Autowired
    private EstadisticasService estadisticasService;

    @GetMapping("/generales")
    public EstadisticasDto getEstadisticasGenerales() {
        return estadisticasService.getEstadisticasGenerales();
    }

    @GetMapping("/actividad-reciente")
    public List<ActividadRecienteDto> getActividadReciente() {
        return estadisticasService.getActividadReciente();
    }

    @GetMapping("/profesor/{profesorId}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    public EstadisticasProfesorDto getEstadisticasProfesor(@PathVariable Long profesorId) {
        return estadisticasService.getEstadisticasProfesor(profesorId);
    }

    @GetMapping("/estudiante/{estudianteId}")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('ADMIN')")
    public EstadisticasEstudianteDto getEstadisticasEstudiante(@PathVariable Long estudianteId) {
        return estadisticasService.getEstadisticasEstudiante(estudianteId);
    }
}
