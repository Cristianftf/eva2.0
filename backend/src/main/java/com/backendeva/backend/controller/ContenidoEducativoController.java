package com.backendeva.backend.controller;

import com.backendeva.backend.model.ContenidoEducativo;
import com.backendeva.backend.services.ContenidoEducativoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para manejo de contenido educativo de Competencia Informacional
 */
@RestController
@RequestMapping("/api/contenido-educativo")
@CrossOrigin(origins = "*")
public class ContenidoEducativoController {
    
    @Autowired
    private ContenidoEducativoService contenidoEducativoService;
    
    /**
     * Crear contenido educativo
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR')")
    public ResponseEntity<ContenidoEducativo> crearContenido(@RequestBody ContenidoEducativo contenido) {
        try {
            ContenidoEducativo nuevoContenido = contenidoEducativoService.guardarContenido(contenido);
            return ResponseEntity.ok(nuevoContenido);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener todo el contenido educativo de un curso
     */
    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<ContenidoEducativo>> getContenidoByCurso(@PathVariable Long cursoId) {
        try {
            List<ContenidoEducativo> contenido = contenidoEducativoService.getContenidoByCurso(cursoId);
            return ResponseEntity.ok(contenido);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener contenido por tipo
     */
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<ContenidoEducativo>> getContenidoByTipo(@PathVariable String tipo) {
        try {
            List<ContenidoEducativo> contenido = contenidoEducativoService.getContenidoByTipo(tipo);
            return ResponseEntity.ok(contenido);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener contenido por curso y tipo
     */
    @GetMapping("/curso/{cursoId}/tipo/{tipo}")
    public ResponseEntity<List<ContenidoEducativo>> getContenidoByCursoAndTipo(
            @PathVariable Long cursoId, 
            @PathVariable String tipo) {
        try {
            List<ContenidoEducativo> contenido = contenidoEducativoService.getContenidoByCursoAndTipo(cursoId, tipo);
            return ResponseEntity.ok(contenido);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener contenido por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ContenidoEducativo> getContenidoById(@PathVariable Long id) {
        try {
            return contenidoEducativoService.getContenidoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Actualizar contenido educativo
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR')")
    public ResponseEntity<ContenidoEducativo> actualizarContenido(
            @PathVariable Long id, 
            @RequestBody ContenidoEducativo contenidoDetails) {
        try {
            ContenidoEducativo contenido = contenidoEducativoService.actualizarContenido(id, contenidoDetails);
            return ResponseEntity.ok(contenido);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Eliminar contenido educativo
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR')")
    public ResponseEntity<Void> eliminarContenido(@PathVariable Long id) {
        try {
            contenidoEducativoService.eliminarContenido(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Verificar si existe contenido de un tipo específico en un curso
     */
    @GetMapping("/curso/{cursoId}/tipo/{tipo}/existe")
    public ResponseEntity<Boolean> existeContenidoByCursoAndTipo(
            @PathVariable Long cursoId, 
            @PathVariable String tipo) {
        try {
            boolean existe = contenidoEducativoService.existeContenidoByCursoAndTipo(cursoId, tipo);
            return ResponseEntity.ok(existe);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Crear contenido predefinido sobre operadores booleanos para un curso
     */
    @PostMapping("/curso/{cursoId}/operadores-booleanos")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR')")
    public ResponseEntity<String> crearContenidoOperadoresBooleanos(@PathVariable Long cursoId) {
        try {
            contenidoEducativoService.crearContenidoOperadoresBooleanos(cursoId);
            return ResponseEntity.ok("Contenido de operadores booleanos creado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear contenido: " + e.getMessage());
        }
    }
}