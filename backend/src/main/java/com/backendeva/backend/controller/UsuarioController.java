package com.backendeva.backend.controller;

import com.backendeva.backend.model.User;
import com.backendeva.backend.services.UsuarioService;
import com.backendeva.backend.services.CursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private CursoService cursoService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public User createUsuario(@RequestBody User user) {
        return usuarioService.save(user);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsuarios() {
        return usuarioService.findAll();
    }

    @GetMapping("/chat-contacts")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESOR') or hasRole('ADMIN')")
    public List<User> getChatContacts() {
        // Retornar todos los usuarios activos excepto el usuario actual (se filtra en frontend)
        return usuarioService.findAll().stream()
                .filter(u -> u.isActivo() && !u.getRol().equals("ADMIN"))
                .toList();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUsuarioById(@PathVariable Long id) {
        return usuarioService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUsuario(@PathVariable Long id, @RequestBody User userDetails) {
        return ResponseEntity.ok(usuarioService.update(id, userDetails));
    }

    @GetMapping("/rol/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getUsuariosByRole(@PathVariable String role) {
        return usuarioService.findByRole(role);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUsuario(@PathVariable Long id) {
        try {
            // Verificar si el usuario tiene cursos asociados antes de intentar eliminar
            if (usuarioService.tieneCursosAsociados(id)) {
                List<User> profesoresDisponibles = usuarioService.findByRole("PROFESOR");
                profesoresDisponibles.removeIf(p -> p.getId().equals(id)); // Remover el usuario actual
                
                Map<String, Object> response = new HashMap<>();
                response.put("error", "No se puede eliminar el usuario porque es profesor de cursos activos");
                response.put("cursosAsociados", cursoService.getByProfesor(id).size());
                response.put("solucion", "Transfiera los cursos a otro profesor antes de eliminar");
                response.put("profesoresDisponibles", profesoresDisponibles.size());
                
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
            
            usuarioService.deleteById(id);
            return ResponseEntity.noContent().build();
            
        } catch (DataIntegrityViolationException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "No se puede eliminar el usuario debido a dependencias en la base de datos");
            response.put("message", "El usuario tiene cursos o estudiantes asociados");
            response.put("detalle", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Usuario no encontrado");
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PostMapping("/clean-duplicates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> cleanDuplicateUsers() {
        int deleted = usuarioService.cleanDuplicateUsers();
        return ResponseEntity.ok("Se eliminaron " + deleted + " usuarios duplicados");
    }
    
    /**
     * Transfiere todos los cursos de un profesor a otro
     * @param profesorActualId ID del profesor actual
     * @param nuevoProfesorId ID del nuevo profesor
     * @return ResponseEntity con el resultado de la operación
     */
    @PostMapping("/{profesorActualId}/transferir-cursos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> transferirCursos(@PathVariable Long profesorActualId, 
                                            @RequestParam Long nuevoProfesorId) {
        try {
            usuarioService.transferirCursos(profesorActualId, nuevoProfesorId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Cursos transferidos exitosamente");
            response.put("profesorAnterior", profesorActualId);
            response.put("nuevoProfesor", nuevoProfesorId);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Error al transferir cursos");
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    /**
     * Obtiene información sobre cursos asociados a un usuario
     * @param userId ID del usuario
     * @return ResponseEntity con la información
     */
    @GetMapping("/{userId}/cursos-asociados")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getCursosAsociados(@PathVariable Long userId) {
        try {
            List<User> profesores = usuarioService.findByRole("PROFESOR");
            User usuario = usuarioService.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            List<User> profesoresDisponibles = profesores.stream()
                    .filter(p -> !p.getId().equals(userId))
                    .toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("usuario", usuario);
            response.put("cursosAsociados", cursoService.getByProfesor(userId).size());
            response.put("profesoresDisponibles", profesoresDisponibles);
            response.put("puedeEliminarse", cursoService.getByProfesor(userId).isEmpty());
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Error al obtener información");
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String token) {
        // Extraer email del JWT para debugging
        try {
            String email = extractEmailFromToken(token.replace("Bearer ", ""));
            User user = usuarioService.findAll().stream()
                    .filter(u -> u.getEmail().equals(email))
                    .findFirst()
                    .orElse(null);
            return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private String extractEmailFromToken(String token) {
        // Simple extraction for debugging - in production use proper JWT parsing
        try {
            String[] parts = token.split("\\.");
            if (parts.length >= 2) {
                String payload = new String(java.util.Base64.getDecoder().decode(parts[1]));
                if (payload.contains("\"sub\":\"")) {
                    int start = payload.indexOf("\"sub\":\"") + 7;
                    int end = payload.indexOf("\"", start);
                    return payload.substring(start, end);
                }
            }
        } catch (Exception e) {
            // Ignore
        }
        return null;
    }
}
