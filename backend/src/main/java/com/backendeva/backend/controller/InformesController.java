package com.backendeva.backend.controller;

import com.backendeva.backend.dto.InformeCursoDto;
import com.backendeva.backend.services.InformesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/informes")
@CrossOrigin(origins = "*")
public class InformesController {

    @Autowired
    private InformesService informesService;

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<InformeCursoDto> getInformeCurso(@PathVariable Long cursoId) {
        InformeCursoDto informe = informesService.getInformeCurso(cursoId);
        return ResponseEntity.ok(informe);
    }

    @GetMapping("/profesor/{profesorId}")
    public List<InformeCursoDto> getInformesProfesor(@PathVariable Long profesorId) {
        return informesService.getInformesProfesor(profesorId);
    }

    @GetMapping("/estudiante/{estudianteId}/curso/{cursoId}")
    public ResponseEntity<Map<String, Object>> getInformeEstudiante(@PathVariable Long estudianteId, @PathVariable Long cursoId) {
        Map<String, Object> informe = informesService.getInformeEstudiante(estudianteId, cursoId);
        return ResponseEntity.ok(informe);
    }
}