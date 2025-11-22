package com.backendeva.backend.repository;

import com.backendeva.backend.model.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {
    List<Curso> findByProfesorId(Long idProfesor);

    long countByProfesorId(Long profesorId);

    @Query("SELECT COUNT(i) FROM Inscripcion i WHERE i.curso.profesor.id = :profesorId")
    long countEstudiantesByProfesorId(@Param("profesorId") Long profesorId);

    @Query("SELECT COUNT(c) FROM Cuestionario c WHERE c.curso.profesor.id = :profesorId")
    long countCuestionariosByProfesorId(@Param("profesorId") Long profesorId);

    @Query("SELECT AVG(r.calificacion) FROM Resultado r WHERE r.cuestionario.curso.profesor.id = :profesorId")
    Double avgCalificacionesByProfesorId(@Param("profesorId") Long profesorId);
}
