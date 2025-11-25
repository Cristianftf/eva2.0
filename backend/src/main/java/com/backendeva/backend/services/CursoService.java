package com.backendeva.backend.services;

import com.backendeva.backend.model.Curso;
import com.backendeva.backend.repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CursoService {

    @Autowired
    private CursoRepository cursoRepository;

    public List<Curso> findAll() {
        return cursoRepository.findAll();
    }

    public Page<Curso> findAll(Pageable pageable) {
        return cursoRepository.findAll(pageable);
    }

    public Optional<Curso> findById(Long id) {
        return cursoRepository.findById(id);
    }

    public Curso save(Curso curso) {
        return cursoRepository.save(curso);
    }

    public void deleteById(Long id) {
        cursoRepository.deleteById(id);
    }

    public Curso update(Long id, Curso cursoDetails) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso not found with id: " + id));

        curso.setTitulo(cursoDetails.getTitulo());
        curso.setDescripcion(cursoDetails.getDescripcion());
        curso.setActivo(cursoDetails.isActivo());
        curso.setFechaCreacion(cursoDetails.getFechaCreacion());

        return cursoRepository.save(curso);
    }

    public List<Curso> getByProfesor(Long idProfesor) {
        return cursoRepository.findByProfesorId(idProfesor);
    }
}
