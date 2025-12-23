package com.backendeva.backend.controller;

import com.backendeva.backend.dto.MultimediaItemDto;
import com.backendeva.backend.model.MultimediaItem;
import com.backendeva.backend.services.MultimediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/multimedia")
@CrossOrigin(origins = "*")
public class MultimediaController {

    @Autowired
    private MultimediaService multimediaService;

    @PostMapping
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    public MultimediaItemDto createMultimedia(@RequestBody MultimediaItem multimedia) {
        MultimediaItem saved = multimediaService.save(multimedia);
        return convertToDto(saved);
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<MultimediaItemDto> uploadMultimedia(
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

            return ResponseEntity.ok(convertToDto(multimedia));
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
    public List<MultimediaItemDto> getAllMultimedia() {
        return multimediaService.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MultimediaItemDto> getMultimediaById(@PathVariable Long id) {
        return multimediaService.findById(id)
                .map(item -> ResponseEntity.ok(convertToDto(item)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<MultimediaItemDto> updateMultimedia(@PathVariable Long id, @RequestBody MultimediaItem multimediaDetails) {
        MultimediaItem updated = multimediaService.update(id, multimediaDetails);
        return ResponseEntity.ok(convertToDto(updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMultimedia(@PathVariable Long id) {
        multimediaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tema/{temaId}")
    public List<MultimediaItemDto> getMultimediaByTema(@PathVariable Long temaId) {
        return multimediaService.getByTema(temaId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private MultimediaItemDto convertToDto(MultimediaItem item) {
        return MultimediaItemDto.builder()
                .id(item.getId())
                .nombreArchivo(item.getNombreArchivo())
                .tipo(item.getTipo())
                .urlArchivo(item.getUrlArchivo())
                .urlSubtitulos(item.getUrlSubtitulos())
                .urlThumbnail(item.getUrlThumbnail())
                .tamanioBytes(item.getTamanioBytes())
                .duracionSegundos(item.getDuracionSegundos())
                .temaId(item.getTema() != null ? item.getTema().getId() : null)
                .fechaSubida(item.getFechaSubida())
                .build();
    }
}