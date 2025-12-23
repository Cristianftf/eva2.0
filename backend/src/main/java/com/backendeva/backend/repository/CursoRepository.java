package com.backendeva.backend.repository;

import com.backendeva.backend.model.Curso;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.QueryHint;
import java.util.List;
import java.util.Optional;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {

    // Consultas básicas optimizadas
    @QueryHints(value = {
        @QueryHint(name = "org.hibernate.cacheable", value = "true"),
        @QueryHint(name = "org.hibernate.cacheRegion", value = "courses")
    })
    List<Curso> findByProfesorId(@Param("idProfesor") Long idProfesor);

    @QueryHints(value = {
        @QueryHint(name = "org.hibernate.cacheable", value = "true")
    })
    List<Curso> findByActivo(@Param("activo") boolean activo);

    @QueryHints(value = {
        @QueryHint(name = "org.hibernate.cacheable", value = "true")
    })
    List<Curso> findByCategoria(@Param("categoria") String categoria);

    // Consultas con paginación
    @QueryHints(value = {
        @QueryHint(name = "org.hibernate.cacheable", value = "true"),
        @QueryHint(name = "org.hibernate.cacheRegion", value = "courses")
    })
    Page<Curso> findByProfesorId(@Param("idProfesor") Long idProfesor, Pageable pageable);

    @QueryHints(value = {
        @QueryHint(name = "org.hibernate.cacheable", value = "true")
    })
    Page<Curso> findByActivoAndCategoria(@Param("activo") boolean activo,
                                        @Param("categoria") String categoria,
                                        Pageable pageable);

    // Consultas de estadísticas optimizadas
    @Query("SELECT COUNT(c) FROM Curso c WHERE c.profesor.id = :profesorId")
    long countByProfesorId(@Param("profesorId") Long profesorId);

    @Query("SELECT COUNT(DISTINCT i.estudiante.id) FROM Inscripcion i WHERE i.curso.profesor.id = :profesorId AND i.estado = 'APROBADA'")
    long countEstudiantesByProfesorId(@Param("profesorId") Long profesorId);

    @Query("SELECT COUNT(c) FROM Cuestionario c WHERE c.curso.profesor.id = :profesorId")
    long countCuestionariosByProfesorId(@Param("profesorId") Long profesorId);

    @Query("SELECT COALESCE(AVG(r.calificacion), 0.0) FROM Resultado r WHERE r.cuestionario.curso.profesor.id = :profesorId")
    Double avgCalificacionesByProfesorId(@Param("profesorId") Long profesorId);

    // Consultas de búsqueda avanzada
    @Query("SELECT c FROM Curso c WHERE c.activo = true AND " +
           "(LOWER(c.titulo) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.descripcion) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.etiquetas) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Curso> searchByQuery(@Param("query") String query);

    @Query("SELECT c FROM Curso c WHERE c.activo = true AND c.nivel = :nivel")
    List<Curso> findByNivel(@Param("nivel") String nivel);

    @Query("SELECT c FROM Curso c WHERE c.activo = true AND c.precio BETWEEN :minPrecio AND :maxPrecio")
    List<Curso> findByPrecioRange(@Param("minPrecio") Double minPrecio,
                                 @Param("maxPrecio") Double maxPrecio);

    // Consultas con fetch joins para evitar N+1
    @Query("SELECT c FROM Curso c LEFT JOIN FETCH c.profesor WHERE c.id = :id")
    Optional<Curso> findByIdWithProfesor(@Param("id") Long id);

    @Query("SELECT c FROM Curso c LEFT JOIN FETCH c.temas WHERE c.id = :id")
    Optional<Curso> findByIdWithTemas(@Param("id") Long id);

    @Query("SELECT c FROM Curso c LEFT JOIN FETCH c.inscripciones WHERE c.id = :id")
    Optional<Curso> findByIdWithInscripciones(@Param("id") Long id);

    // Consultas de existencia optimizadas
    boolean existsByTituloAndProfesorId(@Param("titulo") String titulo,
                                       @Param("profesorId") Long profesorId);

    // Estadísticas generales
    long countByActivo(@Param("activo") boolean activo);

    @Query("SELECT COUNT(c) FROM Curso c WHERE c.activo = true")
    long countCursosActivos();

    @Query("SELECT AVG(c.precio) FROM Curso c WHERE c.activo = true AND c.precio IS NOT NULL")
    Double avgPrecioCursosActivos();

    @Query("SELECT c FROM Curso c WHERE c.activo = true AND c.id NOT IN " +
           "(SELECT i.curso.id FROM Inscripcion i WHERE i.estudiante.id = :estudianteId)")
    List<Curso> findCursosDisponiblesByEstudianteId(@Param("estudianteId") Long estudianteId);
}
