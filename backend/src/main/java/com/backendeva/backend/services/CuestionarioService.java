package com.backendeva.backend.services;

import com.backendeva.backend.model.Cuestionario;
import com.backendeva.backend.model.Curso;
import com.backendeva.backend.repository.CuestionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CuestionarioService {

    @Autowired
    private CuestionarioRepository cuestionarioRepository;

    @Autowired
    private CursoService cursoService; // Para obtener el objeto Curso

    public List<Cuestionario> findByCursoId(Long cursoId) {
        Curso curso = cursoService.findById(cursoId).orElse(null);
        if (curso == null) {
            return List.of(); // O lanzar una excepción
        }
        return cuestionarioRepository.findByCurso(curso);
    }

    public Cuestionario create(Cuestionario cuestionario) {
        // Lógica adicional si es necesario
        return cuestionarioRepository.save(cuestionario);
    }

    public void delete(Long id) {
        cuestionarioRepository.deleteById(id);
    }

    // Podrían agregarse métodos para actualizar y obtener por ID si son necesarios
}