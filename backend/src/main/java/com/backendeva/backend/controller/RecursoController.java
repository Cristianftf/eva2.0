package com.backendeva.backend.controller;

import com.backendeva.backend.model.Recurso;
import com.backendeva.backend.services.RecursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recursos")
@CrossOrigin(origins = "*")
public class RecursoController {

    @Autowired
    private RecursoService recursoService;

    @PostMapping
    public Recurso createRecurso(@RequestBody Recurso recurso) {
        return recursoService.guardarRecurso(recurso);
    }

    @GetMapping
    public List<Recurso> getAllRecursos() {
        return recursoService.getAllRecursos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recurso> getRecursoById(@PathVariable Long id) {
        return recursoService.getRecursoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recurso> updateRecurso(@PathVariable Long id, @RequestBody Recurso recursoDetails) {
        return ResponseEntity.ok(recursoService.updateRecurso(id, recursoDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecurso(@PathVariable Long id) {
        recursoService.deleteRecurso(id);
        return ResponseEntity.noContent().build();
    }
}
