package com.backendeva.backend.services;

import com.backendeva.backend.model.Curso;
import com.backendeva.backend.model.Tema;
import com.backendeva.backend.repository.TemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TemaService {

    @Autowired
    private TemaRepository temaRepository;

    @Autowired
    private CursoService cursoService; // Para obtener el objeto Curso

    public List<Tema> findByCursoId(Long cursoId) {
        Curso curso = cursoService.findById(cursoId).orElse(null);
        if (curso == null) {
            return List.of(); // O lanzar una excepción
        }
        return temaRepository.findByCurso(curso);
    }

    public Tema create(Tema tema) {
        // Lógica adicional como asignar orden si es necesario
        return temaRepository.save(tema);
    }

    public void delete(Long id) {
        temaRepository.deleteById(id);
    }

    // Podrían agregarse métodos para actualizar y obtener por ID si son necesarios
}