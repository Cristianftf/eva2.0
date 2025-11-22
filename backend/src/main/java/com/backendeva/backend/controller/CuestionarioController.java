package com.backendeva.backend.controller;

import com.backendeva.backend.model.Cuestionario;
import com.backendeva.backend.services.CuestionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cuestionarios")
public class CuestionarioController {

    @Autowired
    private CuestionarioService cuestionarioService;

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<Cuestionario>> getCuestionariosByCursoId(@PathVariable Long cursoId) {
        List<Cuestionario> cuestionarios = cuestionarioService.findByCursoId(cursoId);
        return ResponseEntity.ok(cuestionarios);
    }

    @PostMapping
    public ResponseEntity<Cuestionario> createCuestionario(@RequestBody Cuestionario cuestionario) {
        Cuestionario nuevoCuestionario = cuestionarioService.create(cuestionario);
        return new ResponseEntity<>(nuevoCuestionario, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCuestionario(@PathVariable Long id) {
        cuestionarioService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Se pueden agregar métodos PUT/GET por ID si son necesarios en el futuro
}