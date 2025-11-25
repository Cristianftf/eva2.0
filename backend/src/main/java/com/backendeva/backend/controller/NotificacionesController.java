package com.backendeva.backend.controller;

import com.backendeva.backend.model.Notificacion;
import com.backendeva.backend.services.NotificacionesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin(origins = "*")
public class NotificacionesController {

    @Autowired
    private NotificacionesService notificacionesService;

    @GetMapping
    public List<Notificacion> getAllNotificaciones() {
        return notificacionesService.getAllNotificaciones();
    }

    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasRole('ADMIN') or #usuarioId == authentication.principal.id")
    public List<Notificacion> getNotificacionesByUsuario(@PathVariable Long usuarioId) {
        return notificacionesService.getNotificacionesByUsuario(usuarioId);
    }

    @PostMapping
    public Notificacion createNotificacion(@RequestBody CreateNotificacionRequest request) {
        return notificacionesService.createNotificacion(request.getUsuarioId(), request.getTitulo(), request.getMensaje(), request.getTipo());
    }

    @PatchMapping("/{id}/leer")
    @PreAuthorize("hasRole('ADMIN') or @notificacionesService.isOwnerOfNotification(#id, authentication.principal.id)")
    public Notificacion marcarLeida(@PathVariable Long id) {
        return notificacionesService.marcarComoLeida(id);
    }

    @PatchMapping("/usuario/{usuarioId}/leer-todas")
    @PreAuthorize("hasRole('ADMIN') or #usuarioId == authentication.principal.id")
    public ResponseEntity<Void> marcarTodasLeidas(@PathVariable Long usuarioId) {
        notificacionesService.marcarTodasComoLeidas(usuarioId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotificacion(@PathVariable Long id) {
        notificacionesService.deleteNotificacion(id);
        return ResponseEntity.noContent().build();
    }

    public static class CreateNotificacionRequest {
        private Long usuarioId;
        private String titulo;
        private String mensaje;
        private String tipo;

        // Getters and setters
        public Long getUsuarioId() { return usuarioId; }
        public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
        public String getTitulo() { return titulo; }
        public void setTitulo(String titulo) { this.titulo = titulo; }
        public String getMensaje() { return mensaje; }
        public void setMensaje(String mensaje) { this.mensaje = mensaje; }
        public String getTipo() { return tipo; }
        public void setTipo(String tipo) { this.tipo = tipo; }
    }
}