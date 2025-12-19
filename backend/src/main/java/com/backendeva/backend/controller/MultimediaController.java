package com.backendeva.backend.controller;

import com.backendeva.backend.model.MultimediaItem;
import com.backendeva.backend.services.MultimediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    public ResponseEntity<MultimediaItem> uploadMultimedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "subtitulos", required = false) MultipartFile subtitulos,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestParam("temaId") Long temaId) {
        try {
            String tipo = detectFileType(file.getContentType());
            MultimediaItem multimedia;

            if (subtitulos != null || thumbnail != null) {
                multimedia = multimediaService.uploadWithExtras(file, subtitulos, thumbnail, temaId, tipo);
            } else {
                multimedia = multimediaService.upload(file, temaId, tipo);
            }

            return ResponseEntity.ok(multimedia);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private String detectFileType(String contentType) {
        if (contentType == null) return "documento";

        if (contentType.startsWith("image/")) {
            return "imagen";
        } else if (contentType.startsWith("video/")) {
            return "video";
        } else if (contentType.startsWith("audio/")) {
            return "audio";
        } else {
            return "documento";
        }
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