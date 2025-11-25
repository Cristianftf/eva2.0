package com.backendeva.backend.controller;

import com.backendeva.backend.dto.InscripcionDto;
import com.backendeva.backend.dto.PaginatedResponseDto;
import com.backendeva.backend.model.Curso;
import com.backendeva.backend.model.Inscripcion;
import com.backendeva.backend.services.CursoService;
import com.backendeva.backend.services.InscripcionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cursos")
@CrossOrigin(origins = "*")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    @Autowired
    private InscripcionService inscripcionService;

    @GetMapping
    public PaginatedResponseDto<Curso> getAllCursos(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize); // page starts from 0
        Page<Curso> cursoPage = cursoService.findAll(pageable);
        return new PaginatedResponseDto<>(cursoPage.getContent(), cursoPage.getTotalElements(), page, pageSize);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Curso> getCursoById(@PathVariable Long id) {
        return cursoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('PROFESOR')")
    public Curso createCurso(@RequestBody Curso curso) {
        return cursoService.save(curso);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROFESOR')")
    public ResponseEntity<Curso> updateCurso(@PathVariable Long id, @RequestBody Curso cursoDetails) {
        return ResponseEntity.ok(cursoService.update(id, cursoDetails));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROFESOR')")
    public ResponseEntity<Void> deleteCurso(@PathVariable Long id) {
        cursoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/profesor/{idProfesor}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    public List<Curso> getCursosByProfesor(@PathVariable Long idProfesor) {
        return cursoService.getByProfesor(idProfesor);
    }

    @PostMapping("/{cursoId}/inscribir")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<Inscripcion> inscribirCurso(@PathVariable Long cursoId, @RequestBody InscripcionRequest request) {
        Inscripcion inscripcion = new Inscripcion();
        // Asumiendo que Inscripcion tiene campos estudiante y curso
        // inscripcion.setEstudiante(request.getEstudianteId());
        // inscripcion.setCurso(cursoId);
        // inscripcion.setProgreso(0);
        // return ResponseEntity.ok(inscripcionService.save(inscripcion));
        // Placeholder
        return ResponseEntity.ok(new Inscripcion());
    }

    @PostMapping("/{cursoId}/desinscribir")
    public ResponseEntity<Void> desinscribirCurso(@PathVariable Long cursoId, @RequestBody InscripcionRequest request) {
        // inscripcionService.deleteByEstudianteAndCurso(request.getEstudianteId(), cursoId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/inscripciones/estudiante/{estudianteId}")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('ADMIN')")
    public ResponseEntity<List<InscripcionDto>> getInscripcionesByEstudiante(@PathVariable Long estudianteId) {
        List<InscripcionDto> inscripciones = inscripcionService.findByEstudianteIdAsDto(estudianteId);
        return ResponseEntity.ok(inscripciones);
    }

    public static class InscripcionRequest {
        private Long estudianteId;

        public Long getEstudianteId() { return estudianteId; }
        public void setEstudianteId(Long estudianteId) { this.estudianteId = estudianteId; }
    }
}