package com.backendeva.backend.controller;

import com.backendeva.backend.dto.UserDto;
import com.backendeva.backend.model.User;
import com.backendeva.backend.services.UsuarioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@Slf4j
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public UserDto createUsuario(@RequestBody User user) {
        User savedUser = usuarioService.save(user);
        return convertToDto(savedUser);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDto> getAllUsuarios() {
        return usuarioService.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/chat-contacts")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESOR') or hasRole('ADMIN')")
    public List<UserDto> getChatContacts() {
        // Retornar todos los usuarios activos excepto el usuario actual (se filtra en frontend)
        return usuarioService.findAll().stream()
                .filter(u -> u.isActivo() && !u.getRol().equals("ADMIN"))
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> getUsuarioById(@PathVariable Long id) {
        return usuarioService.findById(id)
                .map(user -> ResponseEntity.ok(convertToDto(user)))
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
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        usuarioService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/clean-duplicates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> cleanDuplicateUsers() {
        int deleted = usuarioService.cleanDuplicateUsers();
        return ResponseEntity.ok("Se eliminaron " + deleted + " usuarios duplicados");
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@RequestHeader("Authorization") String token) {
        // Extraer email del JWT para debugging
        try {
            String email = extractEmailFromToken(token.replace("Bearer ", ""));
            User user = usuarioService.findAll().stream()
                    .filter(u -> u.getEmail().equals(email))
                    .findFirst()
                    .orElse(null);
            return user != null ? ResponseEntity.ok(convertToDto(user)) : ResponseEntity.notFound().build();
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

    private UserDto convertToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nombre(user.getNombre())
                .apellido(user.getApellido())
                .rol(user.getRol())
                .fotoPerfil(user.getFotoPerfil())
                .fechaRegistro(user.getFechaRegistro())
                .activo(user.isActivo())
                .build();
    }
}
