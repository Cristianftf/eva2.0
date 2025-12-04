package com.backendeva.backend.services;

import com.backendeva.backend.model.Tema;
import com.backendeva.backend.repository.TemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@SuppressWarnings("null")

@Service
public class TemaService {

    @Autowired
    private TemaRepository temaRepository;

    public List<Tema> findAll() {
        return temaRepository.findAll();
    }

    public Optional<Tema> findById(Long id) {
        return temaRepository.findById(id);
    }

    public List<Tema> findByCursoId(Long cursoId) {
        return temaRepository.findByCursoIdOrderByOrden(cursoId);
    }

    public Tema save(Tema tema) {
        return temaRepository.save(tema);
    }

    public void deleteById(Long id) {
        temaRepository.deleteById(id);
    }

    public Tema update(Long id, Tema temaDetails) {
        Tema tema = temaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tema not found with id: " + id));

        tema.setTitulo(temaDetails.getTitulo());
        tema.setDescripcion(temaDetails.getDescripcion());
        tema.setOrden(temaDetails.getOrden());

        return temaRepository.save(tema);
    }
}