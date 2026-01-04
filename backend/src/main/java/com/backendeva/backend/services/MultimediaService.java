package com.backendeva.backend.services;

import com.backendeva.backend.model.MultimediaItem;
import com.backendeva.backend.model.Tema;
import com.backendeva.backend.repository.MultimediaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(MultimediaService.class);

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
        return multimediaRepository.save(java.util.Objects.requireNonNull(multimedia));
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
        logger.info("Iniciando subida de archivo: {} ({} bytes, tipo: {})", 
                   file.getOriginalFilename(), file.getSize(), tipo);
        
        try {
            Tema tema = temaService.findById(temaId)
                    .orElseThrow(() -> new RuntimeException("Tema not found with id: " + temaId));

            Long cursoId = tema.getCurso().getId();
            logger.info("Curso ID: {}, Tema ID: {}", cursoId, temaId);

            // Crear directorio por curso y tema
            Path uploadDir = Paths.get("uploads", "cursos", cursoId.toString(), "temas", temaId.toString());
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
                logger.info("Directorio creado: {}", uploadDir);
            }

            // Generar nombre único para el archivo
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            // Guardar archivo
            Path filePath = uploadDir.resolve(uniqueFilename);
            logger.info("Guardando archivo en: {}", filePath);
            
            long startTime = System.currentTimeMillis();
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            long endTime = System.currentTimeMillis();
            
            logger.info("Archivo guardado exitosamente en {}ms. Tamaño: {} bytes", 
                       (endTime - startTime), file.getSize());

            // Crear MultimediaItem
            MultimediaItem multimedia = new MultimediaItem();
            multimedia.setNombreArchivo(originalFilename != null ? originalFilename : uniqueFilename);
            multimedia.setTipo(tipo);
            multimedia.setUrlArchivo("/uploads/cursos/" + cursoId + "/temas/" + temaId + "/" + uniqueFilename);
            multimedia.setTamañoArchivo(file.getSize());
            multimedia.setMimeType(file.getContentType());
            multimedia.setTema(tema);

            MultimediaItem saved = multimediaRepository.save(multimedia);
            logger.info("MultimediaItem guardado con ID: {}", saved.getId());
            
            return saved;
            
        } catch (Exception e) {
            logger.error("Error durante la subida de archivo: {}", e.getMessage(), e);
            throw e;
        }
    }
}