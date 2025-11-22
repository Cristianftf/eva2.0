package com.backendeva.backend.services;

import com.backendeva.backend.model.Curso;
import com.backendeva.backend.model.Inscripcion;
import com.backendeva.backend.repository.InscripcionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InscripcionService {

    @Autowired
    private InscripcionRepository inscripcionRepository;

    @Autowired
    private CursoService cursoService; // Para obtener el objeto Curso

    public List<Inscripcion> findByCursoId(Long cursoId) {
        Curso curso = cursoService.findById(cursoId).orElse(null);
        if (curso == null) {
            return List.of(); // O lanzar una excepción
        }
        return inscripcionRepository.findByCurso(curso);
    }

    public Inscripcion save(Inscripcion inscripcion) {
        return inscripcionRepository.save(inscripcion);
    }

    public List<Inscripcion> findByEstudianteId(Long estudianteId) {
        return inscripcionRepository.findByEstudianteId(estudianteId);
    }

    // Podrían agregarse métodos para actualizar y obtener por ID si son necesarios
}
