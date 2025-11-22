package com.backendeva.backend.controller;

import com.backendeva.backend.model.Tema;
import com.backendeva.backend.services.TemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/temas")
public class TemaController {

    @Autowired
    private TemaService temaService;

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<Tema>> getTemasByCursoId(@PathVariable Long cursoId) {
        List<Tema> temas = temaService.findByCursoId(cursoId);
        return ResponseEntity.ok(temas);
    }

    @PostMapping
    public ResponseEntity<Tema> createTema(@RequestBody Tema tema) {
        Tema nuevoTema = temaService.create(tema);
        return new ResponseEntity<>(nuevoTema, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTema(@PathVariable Long id) {
        temaService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Se pueden agregar métodos PUT/GET por ID si son necesarios en el futuro
}