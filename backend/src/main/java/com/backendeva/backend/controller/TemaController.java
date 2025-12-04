package com.backendeva.backend.controller;

import com.backendeva.backend.dto.CreateTemaDto;
import com.backendeva.backend.model.Tema;
import com.backendeva.backend.model.Curso;
import com.backendeva.backend.services.TemaService;
import com.backendeva.backend.services.CursoService;
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

    @Autowired
    private CursoService cursoService;

    @PostMapping
    public ResponseEntity<Tema> createTema(@RequestBody CreateTemaDto createTemaDto) {
        try {
            // Buscar el curso por ID
            Curso curso = cursoService.findById(Long.parseLong(createTemaDto.getCursoId()))
                    .orElseThrow(() -> new RuntimeException("Curso not found with id: " + createTemaDto.getCursoId()));

            // Crear el tema
            Tema tema = new Tema();
            tema.setTitulo(createTemaDto.getTitulo());
            tema.setDescripcion(createTemaDto.getDescripcion());
            tema.setOrden(createTemaDto.getOrden());
            tema.setCurso(curso);

            Tema savedTema = temaService.save(tema);
            return ResponseEntity.ok(savedTema);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
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
        return temaService.findByCursoId(cursoId);
    }
}