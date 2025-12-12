package com.backendeva.backend.controller;

import com.backendeva.backend.model.SimulacionBusqueda;
import com.backendeva.backend.services.SimuladorBusquedaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador para simulador de búsqueda académica con operadores booleanos
 */
@RestController
@RequestMapping("/api/simulador-busqueda")
@CrossOrigin(origins = "*")
public class SimuladorBusquedaController {
    
    @Autowired
    private SimuladorBusquedaService simuladorBusquedaService;
    
    /**
     * Ejecutar una simulación de búsqueda
     */
    @PostMapping("/ejecutar")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<SimulacionBusqueda> ejecutarSimulacion(
            @RequestBody SimulacionBusquedaRequest request) {
        try {
            SimulacionBusqueda simulacion = simuladorBusquedaService.ejecutarSimulacion(
                request.getConsulta(),
                request.getCategoria(),
                request.getNivel(),
                request.getUsuarioId()
            );
            return ResponseEntity.ok(simulacion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener simulaciones de un usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<List<SimulacionBusqueda>> getSimulacionesByUsuario(@PathVariable Long usuarioId) {
        try {
            List<SimulacionBusqueda> simulaciones = simuladorBusquedaService.getSimulacionesByUsuario(usuarioId);
            return ResponseEntity.ok(simulaciones);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener estadísticas de simulaciones
     */
    @GetMapping("/estadisticas/{usuarioId}")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getEstadisticas(@PathVariable Long usuarioId) {
        try {
            Map<String, Object> estadisticas = simuladorBusquedaService.getEstadisticasSimulaciones(usuarioId);
            return ResponseEntity.ok(estadisticas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener categorías disponibles para simulación
     */
    @GetMapping("/categorias")
    public ResponseEntity<List<String>> getCategoriasDisponibles() {
        try {
            List<String> categorias = List.of(
                "MEDICINA",
                "TECNOLOGIA", 
                "PSICOLOGIA",
                "EDUCACION",
                "CIENCIAS_SOCIALES",
                "CIENCIAS_NATURALES"
            );
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener niveles de dificultad disponibles
     */
    @GetMapping("/niveles")
    public ResponseEntity<List<String>> getNivelesDisponibles() {
        try {
            List<String> niveles = List.of(
                "BASICO",
                "INTERMEDIO", 
                "AVANZADO"
            );
            return ResponseEntity.ok(niveles);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener ejemplos de búsquedas por nivel
     */
    @GetMapping("/ejemplos/{nivel}")
    public ResponseEntity<List<String>> getEjemplos(@PathVariable String nivel) {
        try {
            List<String> ejemplos = getEjemplosPorNivel(nivel);
            return ResponseEntity.ok(ejemplos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    private List<String> getEjemplosPorNivel(String nivel) {
        return switch (nivel.toUpperCase()) {
            case "BASICO" -> List.of(
                "terapia depresión",
                "inteligencia artificial",
                "diabetes complicaciones",
                "ansiedad estudiantes"
            );
            case "INTERMEDIO" -> List.of(
                "terapia AND depresión",
                "inteligencia artificial AND diagnóstico",
                "diabetes AND complicaciones NOT tipo 1",
                "ansiedad OR estrés AND estudiantes"
            );
            case "AVANZADO" -> List.of(
                "(terapia OR tratamiento) AND depresión AND efectividad",
                "(inteligencia artificial OR machine learning) AND diagnóstico NOT experimental",
                "diabetes AND (complicaciones OR efectos) AND tratamiento NOT pediátrico",
                "(ansiedad OR estrés) AND (estudiantes OR universitarios) AND (rendimiento OR académico)"
            );
            default -> List.of();
        };
    }
    
    // DTO para la petición de simulación
    public static class SimulacionBusquedaRequest {
        private String consulta;
        private String categoria;
        private String nivel;
        private Long usuarioId;
        
        // Constructores
        public SimulacionBusquedaRequest() {}
        
        public SimulacionBusquedaRequest(String consulta, String categoria, String nivel, Long usuarioId) {
            this.consulta = consulta;
            this.categoria = categoria;
            this.nivel = nivel;
            this.usuarioId = usuarioId;
        }
        
        // Getters y Setters
        public String getConsulta() {
            return consulta;
        }
        
        public void setConsulta(String consulta) {
            this.consulta = consulta;
        }
        
        public String getCategoria() {
            return categoria;
        }
        
        public void setCategoria(String categoria) {
            this.categoria = categoria;
        }
        
        public String getNivel() {
            return nivel;
        }
        
        public void setNivel(String nivel) {
            this.nivel = nivel;
        }
        
        public Long getUsuarioId() {
            return usuarioId;
        }
        
        public void setUsuarioId(Long usuarioId) {
            this.usuarioId = usuarioId;
        }
    }
}