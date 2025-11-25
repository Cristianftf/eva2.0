package com.backendeva.backend.repository;

import com.backendeva.backend.model.Inscripcion;
import com.backendeva.backend.model.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {
    List<Inscripcion> findByCurso(Curso curso);
    List<Inscripcion> findByCursoId(Long cursoId);
    List<Inscripcion> findByEstudianteId(Long estudianteId);

    long countByEstudianteId(Long estudianteId);

    long countByEstudianteIdAndProgreso(Long estudianteId, Integer progreso);

    @Query("SELECT AVG(i.progreso) FROM Inscripcion i WHERE i.estudiante.id = :estudianteId")
    Double avgProgresoByEstudianteId(@Param("estudianteId") Long estudianteId);

    long countByCursoId(Long cursoId);

    @Query("SELECT AVG(i.progreso) FROM Inscripcion i WHERE i.curso.id = :cursoId")
    Double avgProgresoByCursoId(@Param("cursoId") Long cursoId);
}
