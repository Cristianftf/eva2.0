package com.backendeva.backend.controller;

import com.backendeva.backend.model.User;
import com.backendeva.backend.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

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
}
