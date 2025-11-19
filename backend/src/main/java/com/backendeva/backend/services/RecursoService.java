package com.backendeva.backend.services;

import com.backendeva.backend.model.Recurso;
import com.backendeva.backend.repository.RecursoRepository;

import io.micrometer.common.lang.NonNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
        return recursoRepository.save(recurso);
        
    }

    public Optional<Recurso> getRecursoById(Long id) {
        return recursoRepository.findById(id);
    }

    public Recurso createRecurso( Recurso recurso) {
        return recursoRepository.save( recurso);
    }

    public Recurso updateRecurso(Long id, Recurso recurso) {
        recurso.setId(id);
        return recursoRepository.save(recurso);
    }

    public void deleteRecurso(Long id) {
        recursoRepository.deleteById(id);
    }
}