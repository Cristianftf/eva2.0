package com.backendeva.backend.services;

import com.backendeva.backend.model.MultimediaItem;
import com.backendeva.backend.repository.MultimediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MultimediaService {

    @Autowired
    private MultimediaRepository multimediaRepository;

    public List<MultimediaItem> findAll() {
        return multimediaRepository.findAll();
    }

    public Optional<MultimediaItem> findById(Long id) {
        return multimediaRepository.findById(id);
    }

    public MultimediaItem save(MultimediaItem multimedia) {
        return multimediaRepository.save(multimedia);
    }

    public void deleteById(Long id) {
        multimediaRepository.deleteById(id);
    }

    public MultimediaItem update(Long id, MultimediaItem multimediaDetails) {
        MultimediaItem multimedia = multimediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Multimedia not found with id: " + id));

        multimedia.setNombreArchivo(multimediaDetails.getNombreArchivo());
        multimedia.setTipo(multimediaDetails.getTipo());
        multimedia.setUrlArchivo(multimediaDetails.getUrlArchivo());
        multimedia.setTema(multimediaDetails.getTema());

        return multimediaRepository.save(multimedia);
    }

    public List<MultimediaItem> getByTema(Long temaId) {
        return multimediaRepository.findByTemaId(temaId);
    }
}