package com.backendeva.backend.controller;

import com.backendeva.backend.model.Tema;
import com.backendeva.backend.services.TemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/temas")
@CrossOrigin(origins = "*")
public class TemaController {

    @Autowired
    private TemaService temaService;

    @PostMapping
    public Tema createTema(@RequestBody Tema tema) {
        return temaService.save(tema);
    }

    @GetMapping
    public List<Tema> getAllTemas() {
        return temaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tema> getTemaById(@PathVariable Long id) {
        return temaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tema> updateTema(@PathVariable Long id, @RequestBody Tema temaDetails) {
        return ResponseEntity.ok(temaService.update(id, temaDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTema(@PathVariable Long id) {
        temaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/curso/{cursoId}")
    public List<Tema> getTemasByCurso(@PathVariable Long cursoId) {
        return temaService.getByCurso(cursoId);
    }
}