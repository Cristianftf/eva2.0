package com.backendeva.backend.controller;

import com.backendeva.backend.dto.EnviarCuestionarioDto;
import com.backendeva.backend.dto.ResultadoCuestionarioDto;
import com.backendeva.backend.model.Cuestionario;
import com.backendeva.backend.services.CuestionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cuestionarios")
@CrossOrigin(origins = "*")
public class CuestionarioController {

    @Autowired
    private CuestionarioService cuestionarioService;

    @GetMapping
    public List<Cuestionario> getAllCuestionarios() {
        return cuestionarioService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cuestionario> getCuestionarioById(@PathVariable Long id) {
        return cuestionarioService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<Cuestionario>> getCuestionariosByCursoId(@PathVariable Long cursoId) {
        List<Cuestionario> cuestionarios = cuestionarioService.findByCursoId(cursoId);
        return ResponseEntity.ok(cuestionarios);
    }

    @GetMapping("/{id}/preguntas")
    public ResponseEntity<List<Map<String, Object>>> getPreguntasByCuestionario(@PathVariable Long id) {
        List<Map<String, Object>> preguntas = cuestionarioService.getPreguntasByCuestionarioId(id);
        return ResponseEntity.ok(preguntas);
    }

    @PostMapping
    public ResponseEntity<Cuestionario> createCuestionario(@RequestBody Cuestionario cuestionario) {
        Cuestionario nuevoCuestionario = cuestionarioService.create(cuestionario);
        return new ResponseEntity<>(nuevoCuestionario, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/responder")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<Map<String, Object>> responderCuestionario(@PathVariable Long id, @RequestBody EnviarCuestionarioDto respuestas) {
        Map<String, Object> resultado = cuestionarioService.responderCuestionario(id, respuestas);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/{id}/resultados")
    public ResponseEntity<List<Map<String, Object>>> getResultados(@PathVariable Long id) {
        List<Map<String, Object>> resultados = cuestionarioService.getResultados(id);
        return ResponseEntity.ok(resultados);
    }

    @GetMapping("/resultados/estudiante/{estudianteId}")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('ADMIN')")
    public ResponseEntity<List<ResultadoCuestionarioDto>> getResultadosByEstudiante(@PathVariable Long estudianteId) {
        List<ResultadoCuestionarioDto> resultados = cuestionarioService.getResultadosByEstudiante(estudianteId);
        return ResponseEntity.ok(resultados);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCuestionario(@PathVariable Long id) {
        cuestionarioService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}