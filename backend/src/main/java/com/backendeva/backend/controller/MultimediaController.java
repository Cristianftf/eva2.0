package com.backendeva.backend.controller;

import com.backendeva.backend.model.MultimediaItem;
import com.backendeva.backend.services.MultimediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/multimedia")
@CrossOrigin(origins = "*")
public class MultimediaController {

    @Autowired
    private MultimediaService multimediaService;

    @PostMapping
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    public MultimediaItem createMultimedia(@RequestBody MultimediaItem multimedia) {
        return multimediaService.save(multimedia);
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    public MultimediaItem uploadMultimedia(@RequestBody MultimediaItem multimedia) {
        // En una implementación real, aquí se manejaría la subida de archivos
        // Por ahora, solo guardamos la información
        return multimediaService.save(multimedia);
    }

    @GetMapping
    public List<MultimediaItem> getAllMultimedia() {
        return multimediaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MultimediaItem> getMultimediaById(@PathVariable Long id) {
        return multimediaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<MultimediaItem> updateMultimedia(@PathVariable Long id, @RequestBody MultimediaItem multimediaDetails) {
        return ResponseEntity.ok(multimediaService.update(id, multimediaDetails));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMultimedia(@PathVariable Long id) {
        multimediaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tema/{temaId}")
    public List<MultimediaItem> getMultimediaByTema(@PathVariable Long temaId) {
        return multimediaService.getByTema(temaId);
    }
}