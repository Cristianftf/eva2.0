package com.backendeva.backend.controller;

import com.backendeva.backend.model.Curso;
import com.backendeva.backend.services.CursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cursos")
@CrossOrigin(origins = "*")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    @GetMapping
    public List<Curso> getAllCursos() {
        return cursoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Curso> getCursoById(@PathVariable Long id) {
        return cursoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Curso createCurso(@RequestBody Curso curso) {
        return cursoService.save(curso);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Curso> updateCurso(@PathVariable Long id, @RequestBody Curso cursoDetails) {
        return ResponseEntity.ok(cursoService.update(id, cursoDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCurso(@PathVariable Long id) {
        cursoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/profesor/{idProfesor}")
    public List<Curso> getCursosByProfesor(@PathVariable Long idProfesor) {
        return cursoService.getByProfesor(idProfesor);
    }
}