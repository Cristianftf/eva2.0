package com.backendeva.backend.repository;

import com.backendeva.backend.model.Tema;
import com.backendeva.backend.model.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemaRepository extends JpaRepository<Tema, Long> {
    List<Tema> findByCurso(Curso curso);
    List<Tema> findByCursoId(Long cursoId);
}