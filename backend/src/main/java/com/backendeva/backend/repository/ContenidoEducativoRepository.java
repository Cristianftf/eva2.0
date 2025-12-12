package com.backendeva.backend.repository;

import com.backendeva.backend.model.ContenidoEducativo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para contenido educativo de Competencia Informacional
 */
@Repository
public interface ContenidoEducativoRepository extends JpaRepository<ContenidoEducativo, Long> {
    
    /**
     * Encontrar contenido por curso
     */
    List<ContenidoEducativo> findByCursoIdAndActivoTrueOrderByOrdenAsc(Long cursoId);
    
    /**
     * Encontrar contenido por tipo
     */
    List<ContenidoEducativo> findByTipoContenidoAndActivoTrue(String tipoContenido);
    
    /**
     * Encontrar contenido por curso y tipo
     */
    List<ContenidoEducativo> findByCursoIdAndTipoContenidoAndActivoTrue(Long cursoId, String tipoContenido);
    
    /**
     * Encontrar contenido por nivel de dificultad
     */
    List<ContenidoEducativo> findByNivelDificultadAndActivoTrue(String nivelDificultad);
    
    /**
     * Obtener todo el contenido educativo de un curso ordenado
     */
    @Query("SELECT c FROM ContenidoEducativo c WHERE c.curso.id = :cursoId AND c.activo = true ORDER BY c.orden ASC")
    List<ContenidoEducativo> findContenidoEducativoByCurso(@Param("cursoId") Long cursoId);
    
    /**
     * Verificar si existe contenido de un tipo específico en un curso
     */
    @Query("SELECT COUNT(c) > 0 FROM ContenidoEducativo c WHERE c.curso.id = :cursoId AND c.tipoContenido = :tipo AND c.activo = true")
    boolean existsContenidoByCursoAndTipo(@Param("cursoId") Long cursoId, @Param("tipo") String tipo);
}