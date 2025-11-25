package com.backendeva.backend.repository;

import com.backendeva.backend.model.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

    List<Mensaje> findByRemitenteIdAndDestinatarioIdOrderByFechaEnvioDesc(Long remitenteId, Long destinatarioId);

    List<Mensaje> findByCursoIdOrderByFechaEnvioDesc(Long cursoId);
}