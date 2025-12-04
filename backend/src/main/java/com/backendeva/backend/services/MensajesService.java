package com.backendeva.backend.services;

import com.backendeva.backend.model.Mensaje;
import com.backendeva.backend.repository.MensajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("null")
public class MensajesService {

    @Autowired
    private MensajeRepository mensajeRepository;

    public List<Mensaje> findAll() {
        return mensajeRepository.findAll();
    }

    public Optional<Mensaje> findById(Long id) {
        return mensajeRepository.findById(id);
    }

    public Mensaje save(Mensaje mensaje) {
        return mensajeRepository.save(mensaje);
    }

    public void deleteById(Long id) {
        mensajeRepository.deleteById(id);
    }

    public Mensaje update(Long id, Mensaje mensajeDetails) {
        Mensaje mensaje = mensajeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mensaje not found with id: " + id));

        mensaje.setContenido(mensajeDetails.getContenido());
        mensaje.setLeido(mensajeDetails.isLeido());

        return mensajeRepository.save(mensaje);
    }

    public List<Mensaje> getConversacion(Long user1Id, Long user2Id) {
        return mensajeRepository.findByRemitenteIdAndDestinatarioIdOrderByFechaEnvioDesc(user1Id, user2Id);
    }

    public List<Mensaje> getMensajesCurso(Long cursoId) {
        return mensajeRepository.findByCursoIdOrderByFechaEnvioDesc(cursoId);
    }

    public Mensaje marcarComoLeido(Long id) {
        Mensaje mensaje = mensajeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mensaje not found with id: " + id));
        mensaje.setLeido(true);
        return mensajeRepository.save(mensaje);
    }
}