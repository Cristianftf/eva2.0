package com.backendeva.backend.services;

import com.backendeva.backend.model.MultimediaItem;
import com.backendeva.backend.model.Tema;
import com.backendeva.backend.repository.MultimediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MultimediaService {

    @Autowired
    private MultimediaRepository multimediaRepository;

    @Autowired
    private TemaService temaService;

    public List<MultimediaItem> findAll() {
        return multimediaRepository.findAll();
    }

    public Optional<MultimediaItem> findById(Long id) {
        return multimediaRepository.findById(java.util.Objects.requireNonNull(id));
    }

    public MultimediaItem save(MultimediaItem multimedia) {
        return multimediaRepository.save(multimedia);
    }

    public void deleteById(Long id) {
        multimediaRepository.deleteById(java.util.Objects.requireNonNull(id));
    }

    public MultimediaItem update(Long id, MultimediaItem multimediaDetails) {
        MultimediaItem multimedia = multimediaRepository.findById(java.util.Objects.requireNonNull(id))
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

    public MultimediaItem upload(MultipartFile file, Long temaId, String tipo) throws IOException {
        Tema tema = temaService.findById(temaId)
                .orElseThrow(() -> new RuntimeException("Tema not found with id: " + temaId));

        Long cursoId = tema.getCurso().getId();

        // Crear directorio por curso y tema
        Path uploadDir = Paths.get("uploads", "cursos", cursoId.toString(), "temas", temaId.toString());
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // Generar nombre único para el archivo
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // Guardar archivo principal
        Path filePath = uploadDir.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Crear MultimediaItem
        MultimediaItem multimedia = new MultimediaItem();
        multimedia.setNombreArchivo(originalFilename != null ? originalFilename : uniqueFilename);
        multimedia.setTipo(tipo);
        multimedia.setUrlArchivo("/uploads/cursos/" + cursoId + "/temas/" + temaId + "/" + uniqueFilename);
        multimedia.setTamanioBytes(file.getSize());
        multimedia.setTema(tema);

        // Para videos, intentar extraer duración (simplificado)
        if (tipo.equals("video") && extension.equalsIgnoreCase(".mp4")) {
            // En una implementación real, usar librerías como FFmpeg para extraer metadata
            multimedia.setDuracionSegundos(0); // Placeholder
        }

        return multimediaRepository.save(multimedia);
    }

    public MultimediaItem uploadWithExtras(MultipartFile file, MultipartFile subtitulos, MultipartFile thumbnail, Long temaId, String tipo) throws IOException {
        MultimediaItem multimedia = upload(file, temaId, tipo);

        if (subtitulos != null && !subtitulos.isEmpty()) {
            String subtitulosUrl = saveAdditionalFile(subtitulos, multimedia.getTema().getCurso().getId(), multimedia.getTema().getId(), "subtitulos");
            multimedia.setUrlSubtitulos(subtitulosUrl);
        }

        if (thumbnail != null && !thumbnail.isEmpty()) {
            String thumbnailUrl = saveAdditionalFile(thumbnail, multimedia.getTema().getCurso().getId(), multimedia.getTema().getId(), "thumbnails");
            multimedia.setUrlThumbnail(thumbnailUrl);
        }

        return multimediaRepository.save(multimedia);
    }

    private String saveAdditionalFile(MultipartFile file, Long cursoId, Long temaId, String subfolder) throws IOException {
        Path uploadDir = Paths.get("uploads", "cursos", cursoId.toString(), "temas", temaId.toString(), subfolder);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        Path filePath = uploadDir.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/cursos/" + cursoId + "/temas/" + temaId + "/" + subfolder + "/" + uniqueFilename;
    }
}