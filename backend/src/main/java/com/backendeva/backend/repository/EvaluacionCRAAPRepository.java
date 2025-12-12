package com.backendeva.backend.repository;

import com.backendeva.backend.model.EvaluacionCRAAP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para evaluaciones CRAAP
 */
@Repository
public interface EvaluacionCRAAPRepository extends JpaRepository<EvaluacionCRAAP, Long> {
    
    /**
     * Encontrar evaluaciones por usuario ordenadas por fecha descendente
     */
    List<EvaluacionCRAAP> findByEvaluadorIdOrderByFechaEvaluacionDesc(Long usuarioId);
    
    /**
     * Encontrar evaluaciones por conclusión
     */
    List<EvaluacionCRAAP> findByConclusionOrderByFechaEvaluacionDesc(String conclusion);
    
    /**
     * Encontrar evaluaciones por tipo de fuente
     */
    List<EvaluacionCRAAP> findByTipoFuenteOrderByFechaEvaluacionDesc(String tipoFuente);
    
    /**
     * Obtener estadísticas de evaluaciones por usuario
     */
    @Query("SELECT " +
           "COUNT(e) as total, " +
           "AVG(e.puntuacionTotal) as puntuacionPromedio " +
           "FROM EvaluacionCRAAP e WHERE e.evaluador.id = :usuarioId")
    Object getEstadisticasByUsuario(@Param("usuarioId") Long usuarioId);
    
    /**
     * Contar evaluaciones por conclusión
     */
    @Query("SELECT e.conclusion, COUNT(e) as cantidad " +
           "FROM EvaluacionCRAAP e WHERE e.evaluador.id = :usuarioId " +
           "GROUP BY e.conclusion")
    List<Object> getConteoPorConclusion(@Param("usuarioId") Long usuarioId);
    
    /**
     * Calcular puntuación promedio por criterio
     */
    @Query("SELECT " +
           "AVG(e.currencyPuntuacion) as currency, " +
           "AVG(e.relevancePuntuacion) as relevance, " +
           "AVG(e.authorityPuntuacion) as authority, " +
           "AVG(e.accuracyPuntuacion) as accuracy, " +
           "AVG(e.purposePuntuacion) as purpose " +
           "FROM EvaluacionCRAAP e WHERE e.evaluador.id = :usuarioId")
    Object getPuntuacionPromedioPorCriterio(@Param("usuarioId") Long usuarioId);
}