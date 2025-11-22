package com.backendeva.backend.repository;

import com.backendeva.backend.model.Cuestionario;
import com.backendeva.backend.model.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CuestionarioRepository extends JpaRepository<Cuestionario, Long> {
    List<Cuestionario> findByCurso(Curso curso);
    List<Cuestionario> findByCursoId(Long cursoId);
}