package com.backendeva.backend.controller;

import com.backendeva.backend.model.Mensaje;
import com.backendeva.backend.services.MensajesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mensajes")
@CrossOrigin(origins = "*")
public class MensajesController {

    @Autowired
    private MensajesService mensajesService;

    @PostMapping
    public Mensaje createMensaje(@RequestBody Mensaje mensaje) {
        return mensajesService.save(mensaje);
    }

    @PostMapping("/enviar")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESOR') or hasRole('ADMIN')")
    public Mensaje enviarMensaje(@RequestBody Mensaje mensaje) {
        return mensajesService.save(mensaje);
    }

    @GetMapping
    public List<Mensaje> getAllMensajes() {
        return mensajesService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mensaje> getMensajeById(@PathVariable Long id) {
        return mensajesService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mensaje> updateMensaje(@PathVariable Long id, @RequestBody Mensaje mensajeDetails) {
        return ResponseEntity.ok(mensajesService.update(id, mensajeDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMensaje(@PathVariable Long id) {
        mensajesService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/conversacion/{userId1}/{userId2}")
    @PreAuthorize("hasRole('ADMIN') or #userId1 == authentication.principal.id or #userId2 == authentication.principal.id")
    public List<Mensaje> getConversacion(@PathVariable Long userId1, @PathVariable Long userId2) {
        return mensajesService.getConversacion(userId1, userId2);
    }

    @GetMapping("/curso/{cursoId}")
    public List<Mensaje> getMensajesCurso(@PathVariable Long cursoId) {
        return mensajesService.getMensajesCurso(cursoId);
    }

    @PatchMapping("/{id}/leer")
    public ResponseEntity<Mensaje> marcarComoLeido(@PathVariable Long id) {
        return ResponseEntity.ok(mensajesService.marcarComoLeido(id));
    }
}