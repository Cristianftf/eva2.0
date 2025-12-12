package com.backendeva.backend.services;

import com.backendeva.backend.model.Recurso;
import com.backendeva.backend.repository.RecursoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RecursoService {

    @Autowired
    private RecursoRepository recursoRepository;

    public List<Recurso> getAllRecursos() {
        return recursoRepository.findAll();
    }
    public Recurso guardarRecurso(Recurso recurso){
        if (recurso.getFechaAgregado() == null) {
            recurso.setFechaAgregado(LocalDateTime.now());
        }
        return recursoRepository.save(recurso);

    }

    public Optional<Recurso> getRecursoById(Long id) {
        return recursoRepository.findById(java.util.Objects.requireNonNull(id));
    }

    public Recurso createRecurso( Recurso recurso) {
        return recursoRepository.save(java.util.Objects.requireNonNull(recurso));
    }

    public Recurso updateRecurso(Long id, Recurso recurso) {
        recurso.setId(id);
        return recursoRepository.save(recurso);
    }

    public List<Recurso> getRecursosByCategoria(String categoria) {
        return recursoRepository.findByCategoria(categoria);
    }

    public void deleteRecurso(Long id) {
        recursoRepository.deleteById(java.util.Objects.requireNonNull(id));
    }
}