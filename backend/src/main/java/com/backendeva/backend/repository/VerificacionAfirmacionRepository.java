package com.backendeva.backend.repository;

import com.backendeva.backend.model.VerificacionAfirmacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio para verificaciones de afirmaciones de salud
 */
@Repository
public interface VerificacionAfirmacionRepository extends JpaRepository<VerificacionAfirmacion, Long> {

    // Buscar verificaciones por usuario
    List<VerificacionAfirmacion> findByUsuarioIdOrderByFechaVerificacionDesc(Long usuarioId);

    // Buscar verificaciones por categoría
    List<VerificacionAfirmacion> findByCategoriaOrderByFechaVerificacionDesc(String categoria);

    // Buscar verificaciones por nivel de veracidad
    List<VerificacionAfirmacion> findByNivelVeracidadOrderByFechaVerificacionDesc(String nivelVeracidad);

    // Buscar verificaciones por usuario y categoría
    List<VerificacionAfirmacion> findByUsuarioIdAndCategoriaOrderByFechaVerificacionDesc(Long usuarioId, String categoria);

    // Contar verificaciones por usuario
    Long countByUsuarioId(Long usuarioId);

    // Contar verificaciones por nivel de veracidad para un usuario
    Long countByUsuarioIdAndNivelVeracidad(Long usuarioId, String nivelVeracidad);

    // Obtener promedio de puntaje de veracidad por usuario
    @Query("SELECT AVG(v.puntajeVeracidad) FROM VerificacionAfirmacion v WHERE v.usuario.id = :usuarioId")
    Double getPromedioPuntajeByUsuarioId(@Param("usuarioId") Long usuarioId);

    // Obtener verificaciones recientes (últimos 30 días)
    @Query("SELECT v FROM VerificacionAfirmacion v WHERE v.fechaVerificacion >= :fecha ORDER BY v.fechaVerificacion DESC")
    List<VerificacionAfirmacion> findRecientes(@Param("fecha") LocalDateTime fecha);

    // Buscar verificaciones similares (para evitar duplicados)
    @Query("SELECT v FROM VerificacionAfirmacion v WHERE LOWER(v.afirmacion) LIKE LOWER(CONCAT('%', :afirmacion, '%'))")
    List<VerificacionAfirmacion> findByAfirmacionSimilar(@Param("afirmacion") String afirmacion);

    // Estadísticas por categoría
    @Query("SELECT v.categoria, COUNT(v), AVG(v.puntajeVeracidad) FROM VerificacionAfirmacion v GROUP BY v.categoria")
    List<Object[]> getEstadisticasPorCategoria();

    // Estadísticas por usuario
    @Query("SELECT v.nivelVeracidad, COUNT(v) FROM VerificacionAfirmacion v WHERE v.usuario.id = :usuarioId GROUP BY v.nivelVeracidad")
    List<Object[]> getEstadisticasNivelByUsuario(@Param("usuarioId") Long usuarioId);
}
