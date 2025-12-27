package com.backendeva.backend.controller;

import com.backendeva.backend.dto.EnviarCuestionarioDto;
import com.backendeva.backend.dto.CreateCuestionarioDto;
import com.backendeva.backend.model.Cuestionario;
import com.backendeva.backend.model.User;
import com.backendeva.backend.model.Resultado;
import com.backendeva.backend.services.CuestionarioService;
import com.backendeva.backend.services.CursoService;
import com.backendeva.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cuestionarios")
@CrossOrigin(origins = "*")
public class CuestionarioController {

    @Autowired
    private CuestionarioService cuestionarioService;
    
    @Autowired
    private CursoService cursoService;
    
    @Autowired
    private UserRepository userRepository;

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
    public ResponseEntity<?> createCuestionario(@RequestBody CreateCuestionarioDto cuestionarioDto) {
        try {
            // ✅ Validar datos de entrada
            if (!cuestionarioDto.isValid()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datos inválidos");
                errorResponse.put("message", cuestionarioDto.getValidationErrors());
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // ✅ Verificar que el curso existe
            if (cursoService.findById(cuestionarioDto.getCursoId()).isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Curso no encontrado");
                errorResponse.put("message", "No existe un curso con ID: " + cuestionarioDto.getCursoId());
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // ✅ Crear cuestionario con validaciones
            Cuestionario nuevoCuestionario = cuestionarioService.createFromDto(cuestionarioDto);
            return new ResponseEntity<>(nuevoCuestionario, HttpStatus.CREATED);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al crear cuestionario");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
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
    public ResponseEntity<List<Map<String, Object>>> getResultadosByEstudiante(@PathVariable Long estudianteId) {
        List<Map<String, Object>> resultados = cuestionarioService.getResultadosByEstudiante(estudianteId);
        return ResponseEntity.ok(resultados);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCuestionario(@PathVariable Long id) {
        cuestionarioService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @PostMapping("/{id}/guardar-progreso")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<Resultado> guardarProgreso(
            @PathVariable Long id,
            @RequestBody EnviarCuestionarioDto respuestas,
            @RequestHeader("Authorization") String token) {
        
        // Obtener estudiante del contexto de seguridad
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User estudiante = userRepository.findFirstByEmailOrderByIdAsc(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        Resultado resultado = cuestionarioService.guardarProgreso(id, estudiante.getId(), respuestas.getRespuestas());
        return ResponseEntity.ok(resultado);
    }
}