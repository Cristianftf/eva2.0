package com.backendeva.backend.repository;

import com.backendeva.backend.model.Resultado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ResultadoRepository extends JpaRepository<Resultado, Long> {
    @Query("SELECT AVG(r.calificacion) FROM Resultado r WHERE r.cuestionario.curso.id = :cursoId")
    Double avgCalificacionByCursoId(@Param("cursoId") Long cursoId);

    java.util.List<Resultado> findByEstudianteId(Long estudianteId);
    long countByEstudianteId(Long estudianteId);
}
