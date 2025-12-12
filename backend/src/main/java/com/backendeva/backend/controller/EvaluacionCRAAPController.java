package com.backendeva.backend.controller;

import com.backendeva.backend.model.EvaluacionCRAAP;
import com.backendeva.backend.services.EvaluacionCRAAPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador para evaluaciones CRAAP (Currency, Relevance, Authority, Accuracy, Purpose)
 */
@RestController
@RequestMapping("/api/evaluacion-craap")
@CrossOrigin(origins = "*")
public class EvaluacionCRAAPController {
    
    @Autowired
    private EvaluacionCRAAPService evaluacionCRAAPService;
    
    /**
     * Crear nueva evaluación CRAAP
     */
    @PostMapping
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<EvaluacionCRAAP> crearEvaluacion(
            @RequestBody EvaluacionCRAAP evaluacion,
            @RequestParam(required = false) Long usuarioId) {
        try {
            EvaluacionCRAAP nuevaEvaluacion = evaluacionCRAAPService.crearEvaluacion(evaluacion, usuarioId);
            return ResponseEntity.ok(nuevaEvaluacion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener evaluación por ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<EvaluacionCRAAP> getEvaluacionById(@PathVariable Long id) {
        try {
            return evaluacionCRAAPService.getEvaluacionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener todas las evaluaciones de un usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<List<EvaluacionCRAAP>> getEvaluacionesByUsuario(@PathVariable Long usuarioId) {
        try {
            List<EvaluacionCRAAP> evaluaciones = evaluacionCRAAPService.getEvaluacionesByUsuario(usuarioId);
            return ResponseEntity.ok(evaluaciones);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Actualizar evaluación CRAAP
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<EvaluacionCRAAP> actualizarEvaluacion(
            @PathVariable Long id,
            @RequestBody EvaluacionCRAAP evaluacionDetails) {
        try {
            EvaluacionCRAAP evaluacion = evaluacionCRAAPService.actualizarEvaluacion(id, evaluacionDetails);
            return ResponseEntity.ok(evaluacion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Eliminar evaluación
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarEvaluacion(@PathVariable Long id) {
        try {
            evaluacionCRAAPService.eliminarEvaluacion(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener estadísticas de evaluaciones
     */
    @GetMapping("/estadisticas/{usuarioId}")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getEstadisticas(@PathVariable Long usuarioId) {
        try {
            Map<String, Object> estadisticas = evaluacionCRAAPService.getEstadisticasEvaluaciones(usuarioId);
            return ResponseEntity.ok(estadisticas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener ejemplos de fuentes para evaluar
     */
    @GetMapping("/ejemplos")
    public ResponseEntity<List<EvaluacionCRAAP>> getEjemplosFuentes() {
        try {
            List<EvaluacionCRAAP> ejemplos = evaluacionCRAAPService.getEjemplosFuentes();
            return ResponseEntity.ok(ejemplos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener tipos de fuente disponibles
     */
    @GetMapping("/tipos-fuente")
    public ResponseEntity<List<String>> getTiposFuente() {
        try {
            List<String> tipos = List.of(
                EvaluacionCRAAP.TIPO_ARTICULO,
                EvaluacionCRAAP.TIPO_LIBRO,
                EvaluacionCRAAP.TIPO_WEB,
                EvaluacionCRAAP.TIPO_VIDEO,
                EvaluacionCRAAP.TIPO_CONFERENCIA
            );
            return ResponseEntity.ok(tipos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener propósitos disponibles
     */
    @GetMapping("/propositos")
    public ResponseEntity<List<String>> getPropositos() {
        try {
            List<String> propositos = List.of(
                EvaluacionCRAAP.PROPOSITO_INFORMAR,
                EvaluacionCRAAP.PROPOSITO_PERSUADIR,
                EvaluacionCRAAP.PROPOSITO_VENDER,
                EvaluacionCRAAP.PROPOSITO_ENTRETENER,
                EvaluacionCRAAP.PROPOSITO_ACADEMICO
            );
            return ResponseEntity.ok(propositos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener niveles de relevancia disponibles
     */
    @GetMapping("/niveles-relevancia")
    public ResponseEntity<List<String>> getNivelesRelevancia() {
        try {
            List<String> niveles = List.of(
                EvaluacionCRAAP.NIVEL_RELEVANCIA_ALTA,
                EvaluacionCRAAP.NIVEL_RELEVANCIA_MEDIA,
                EvaluacionCRAAP.NIVEL_RELEVANCIA_BAJA
            );
            return ResponseEntity.ok(niveles);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener tipos de sesgo disponibles
     */
    @GetMapping("/tipos-sesgo")
    public ResponseEntity<List<String>> getTiposSesgo() {
        try {
            List<String> sesgos = List.of(
                EvaluacionCRAAP.SESGO_POLITICO,
                EvaluacionCRAAP.SESGO_COMERCIAL,
                EvaluacionCRAAP.SESGO_RELIGIOSO,
                EvaluacionCRAAP.SESGO_IDEOLOGICO
            );
            return ResponseEntity.ok(sesgos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}