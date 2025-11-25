package com.backendeva.backend.controller;

import com.backendeva.backend.model.Inscripcion;
import com.backendeva.backend.services.InscripcionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscripciones")
public class InscripcionController {

    @Autowired
    private InscripcionService inscripcionService;

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<Inscripcion>> getInscripcionesByCursoId(@PathVariable Long cursoId) {
        List<Inscripcion> inscripciones = inscripcionService.findByCursoId(cursoId);
        return ResponseEntity.ok(inscripciones);
    }

    @GetMapping("/estudiante/{estudianteId}")
    public ResponseEntity<List<Inscripcion>> getInscripcionesByEstudianteId(@PathVariable Long estudianteId) {
        List<Inscripcion> inscripciones = inscripcionService.findByEstudianteId(estudianteId);
        return ResponseEntity.ok(inscripciones);
    }

    @PostMapping
    public ResponseEntity<Inscripcion> createInscripcion(@RequestBody Inscripcion inscripcion) {
        Inscripcion nuevaInscripcion = inscripcionService.save(inscripcion);
        return new ResponseEntity<>(nuevaInscripcion, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/progreso")
    public ResponseEntity<Inscripcion> actualizarProgreso(@PathVariable Long id, @RequestBody ProgresoRequest request) {
        Inscripcion inscripcion = inscripcionService.actualizarProgreso(id, request.getProgreso());
        return ResponseEntity.ok(inscripcion);
    }

    public static class ProgresoRequest {
        private int progreso;

        public int getProgreso() { return progreso; }
        public void setProgreso(int progreso) { this.progreso = progreso; }
    }
}
