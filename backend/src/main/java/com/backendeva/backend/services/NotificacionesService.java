package com.backendeva.backend.services;

import com.backendeva.backend.model.Notificacion;
import com.backendeva.backend.model.User;
import com.backendeva.backend.repository.NotificacionRepository;
import com.backendeva.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificacionesService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Notificacion> getAllNotificaciones() {
        return notificacionRepository.findAll();
    }

    public List<Notificacion> getNotificacionesByUsuario(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId);
    }

    public Notificacion createNotificacion(Long usuarioId, String titulo, String mensaje, String tipo) {
        User usuario = userRepository.findById(java.util.Objects.requireNonNull(usuarioId)).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Notificacion notificacion = new Notificacion();
        notificacion.setUsuario(usuario);
        notificacion.setTitulo(titulo);
        notificacion.setMensaje(mensaje);
        notificacion.setTipo(tipo);

        return notificacionRepository.save(notificacion);
    }

    public Notificacion marcarComoLeida(Long id) {
        Notificacion notificacion = notificacionRepository.findById(java.util.Objects.requireNonNull(id)).orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
        notificacion.setLeida(true);
        return notificacionRepository.save(notificacion);
    }

    public void marcarTodasComoLeidas(Long usuarioId) {
        List<Notificacion> notificaciones = notificacionRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId);
        for (Notificacion notif : notificaciones) {
            notif.setLeida(true);
        }
        notificacionRepository.saveAll(java.util.Objects.requireNonNull(notificaciones));
    }

    public void deleteNotificacion(Long id) {
        notificacionRepository.deleteById(java.util.Objects.requireNonNull(id));
    }

    public boolean isOwnerOfNotification(Long notificationId, Long userId) {
        Optional<Notificacion> notif = notificacionRepository.findById(java.util.Objects.requireNonNull(notificationId));
        return notif.isPresent() && notif.get().getUsuario().getId().equals(userId);
    }
}