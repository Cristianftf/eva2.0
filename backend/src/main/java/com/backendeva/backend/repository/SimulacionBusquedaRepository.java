package com.backendeva.backend.repository;

import com.backendeva.backend.model.SimulacionBusqueda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para simulaciones de búsqueda
 */
@Repository
public interface SimulacionBusquedaRepository extends JpaRepository<SimulacionBusqueda, Long> {
    
    /**
     * Encontrar simulaciones por usuario ordenadas por fecha descendente
     */
    List<SimulacionBusqueda> findByUsuarioIdOrderByFechaSimulacionDesc(Long usuarioId);
    
    /**
     * Encontrar simulaciones por categoría
     */
    List<SimulacionBusqueda> findByCategoriaOrderByFechaSimulacionDesc(String categoria);
    
    /**
     * Encontrar simulaciones por nivel de dificultad
     */
    List<SimulacionBusqueda> findByNivelDificultadOrderByFechaSimulacionDesc(String nivelDificultad);
    
    /**
     * Obtener estadísticas de simulaciones por usuario
     */
    @Query("SELECT " +
           "COUNT(s) as total, " +
           "AVG(s.puntuacion) as puntuacionPromedio, " +
           "COUNT(DISTINCT s.categoria) as categoriasPracticas " +
           "FROM SimulacionBusqueda s WHERE s.usuario.id = :usuarioId")
    Object getEstadisticasByUsuario(@Param("usuarioId") Long usuarioId);
    
    /**
     * Contar simulaciones por operador
     */
    @Query("SELECT " +
           "COUNT(CASE WHEN s.operadoresDetectados LIKE '%AND%' THEN 1 END) as usoAnd, " +
           "COUNT(CASE WHEN s.operadoresDetectados LIKE '%OR%' THEN 1 END) as usoOr, " +
           "COUNT(CASE WHEN s.operadoresDetectados LIKE '%NOT%' THEN 1 END) as usoNot " +
           "FROM SimulacionBusqueda s WHERE s.usuario.id = :usuarioId")
    Object getUsoOperadoresByUsuario(@Param("usuarioId") Long usuarioId);
    
    /**
     * Obtener las últimas simulaciones de un usuario
     */
    @Query("SELECT s FROM SimulacionBusqueda s WHERE s.usuario.id = :usuarioId ORDER BY s.fechaSimulacion DESC")
    List<SimulacionBusqueda> findRecentSimulationsByUser(@Param("usuarioId") Long usuarioId);
}