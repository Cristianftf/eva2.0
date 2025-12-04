package com.backendeva.backend.controller;

import com.backendeva.backend.dto.CreateCursoDto;
import com.backendeva.backend.dto.InscripcionDto;
import com.backendeva.backend.dto.PaginatedResponseDto;
import com.backendeva.backend.model.*;
import com.backendeva.backend.services.TemaService;
import com.backendeva.backend.services.CursoService;
import com.backendeva.backend.services.InscripcionService;
import com.backendeva.backend.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/cursos")
@CrossOrigin(origins = "*")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    @Autowired
    private InscripcionService inscripcionService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private TemaService temaService;

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
    public ResponseEntity<Curso> createCurso(@RequestBody CreateCursoDto createCursoDto) {
        try {
            // Buscar el profesor por ID
            User profesor = usuarioService.findById(Long.parseLong(createCursoDto.getProfesorId()))
                    .orElseThrow(() -> new RuntimeException("Profesor not found with id: " + createCursoDto.getProfesorId()));

            // Crear el curso
            Curso curso = new Curso();
            curso.setTitulo(createCursoDto.getTitulo());
            curso.setDescripcion(createCursoDto.getDescripcion());
            curso.setObjetivos(createCursoDto.getObjetivos());
            curso.setDuracionEstimada(createCursoDto.getDuracionEstimada());
            curso.setNivel(createCursoDto.getNivel());
            curso.setCategoria(createCursoDto.getCategoria());
            curso.setActivo(createCursoDto.isActivo());
            curso.setFechaCreacion(LocalDate.now());
            curso.setMetadataLom(createCursoDto.getMetadataLom());
            curso.setProfesor(profesor);

            Curso savedCurso = cursoService.save(curso);
            return ResponseEntity.ok(savedCurso);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
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

    @PostMapping("/{cursoId}/solicitar-inscripcion")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<Inscripcion> solicitarInscripcion(@PathVariable Long cursoId, @RequestBody SolicitudInscripcionRequest request) {
        try {
            Inscripcion inscripcion = inscripcionService.solicitarInscripcion(request.getEstudianteId(), cursoId);
            return ResponseEntity.ok(inscripcion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/aprobar-inscripcion/{inscripcionId}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<Inscripcion> aprobarInscripcion(@PathVariable Long inscripcionId) {
        try {
            Inscripcion inscripcion = inscripcionService.aprobarInscripcion(inscripcionId);
            return ResponseEntity.ok(inscripcion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/rechazar-inscripcion/{inscripcionId}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<Inscripcion> rechazarInscripcion(@PathVariable Long inscripcionId) {
        try {
            Inscripcion inscripcion = inscripcionService.rechazarInscripcion(inscripcionId);
            return ResponseEntity.ok(inscripcion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/solicitudes-pendientes")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<List<InscripcionDto>> getSolicitudesPendientes(@RequestParam Long profesorId) {
        List<InscripcionDto> solicitudes = inscripcionService.getSolicitudesPendientesPorProfesor(profesorId);
        return ResponseEntity.ok(solicitudes);
    }

    @GetMapping("/inscripciones/estudiante/{estudianteId}")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('ADMIN')")
    public ResponseEntity<List<InscripcionDto>> getInscripcionesByEstudiante(@PathVariable Long estudianteId) {
        List<InscripcionDto> inscripciones = inscripcionService.findByEstudianteIdAsDto(estudianteId);
        return ResponseEntity.ok(inscripciones);
    }

    @GetMapping("/{cursoId}/progreso/estudiante/{estudianteId}")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('ADMIN')")
    public ResponseEntity<Integer> getProgresoCurso(@PathVariable Long cursoId, @PathVariable Long estudianteId) {
        int progreso = inscripcionService.getProgresoByEstudianteAndCurso(estudianteId, cursoId);
        return ResponseEntity.ok(progreso);
    }

    @GetMapping("/{cursoId}/temas")
    public ResponseEntity<List<com.backendeva.backend.model.Tema>> getTemasByCurso(@PathVariable Long cursoId) {
        List<com.backendeva.backend.model.Tema> temas = temaService.findByCursoId(cursoId);
        return ResponseEntity.ok(temas);
    }

    public static class SolicitudInscripcionRequest {
        private Long estudianteId;

        public Long getEstudianteId() { return estudianteId; }
        public void setEstudianteId(Long estudianteId) { this.estudianteId = estudianteId; }
    }
}