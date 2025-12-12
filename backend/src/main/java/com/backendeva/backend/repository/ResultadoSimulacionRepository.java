package com.backendeva.backend.repository;

import com.backendeva.backend.model.ResultadoSimulacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para resultados de simulaciones de búsqueda
 */
@Repository
public interface ResultadoSimulacionRepository extends JpaRepository<ResultadoSimulacion, Long> {
    
    /**
     * Encontrar resultados por simulación
     */
    List<ResultadoSimulacion> findBySimulacionIdOrderByPuntuacionRelevanciaDesc(Long simulacionId);
    
    /**
     * Encontrar resultados relevantes por simulación
     */
    List<ResultadoSimulacion> findBySimulacionIdAndRelevanteTrueOrderByPuntuacionRelevanciaDesc(Long simulacionId);
}