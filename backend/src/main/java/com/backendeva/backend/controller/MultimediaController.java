package com.backendeva.backend.controller;

import com.backendeva.backend.model.MultimediaItem;
import com.backendeva.backend.services.MultimediaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/multimedia")
@CrossOrigin(origins = "*")
public class MultimediaController {

    private static final Logger logger = LoggerFactory.getLogger(MultimediaController.class);

    @Autowired
    private MultimediaService multimediaService;

    @PostMapping
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    public MultimediaItem createMultimedia(@RequestBody MultimediaItem multimedia) {
        return multimediaService.save(multimedia);
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<?> uploadMultimedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam("temaId") Long temaId) {
        logger.info("Iniciando subida - Archivo: {}, Tamaño: {} bytes, Tipo: {}, TemaID: {}", 
                   file.getOriginalFilename(), file.getSize(), file.getContentType(), temaId);
                   
        try {
            // Validaciones básicas
            if (file.isEmpty()) {
                logger.warn("Archivo vacío recibido");
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "El archivo está vacío");
                return ResponseEntity.badRequest().body(error);
            }

            // Validar tamaño del archivo (2GB - sin restricción excesiva)
            long maxSize = 2L * 1024 * 1024 * 1024; // 2GB
            if (file.getSize() > maxSize) {
                logger.warn("Archivo demasiado grande: {} bytes (máximo: {} bytes)", file.getSize(), maxSize);
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "El archivo es demasiado grande. Tamaño máximo: 2GB. Tamaño actual: " + (file.getSize() / 1024 / 1024 / 1024) + "GB");
                return ResponseEntity.badRequest().body(error);
            }

            // Validar tipo de archivo
            String contentType = file.getContentType();
            if (contentType == null || !isValidFileType(contentType)) {
                logger.warn("Tipo de archivo no válido: {}", contentType);
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "Tipo de archivo no válido: " + contentType);
                return ResponseEntity.badRequest().body(error);
            }

            // Usar detección múltiple para mayor precisión (sin consumir InputStream)
            String tipo = detectFileTypeAdvanced(file.getContentType(), file.getOriginalFilename(), null);
            logger.info("Tipo detectado: {}", tipo);
            
            MultimediaItem multimedia = multimediaService.upload(file, temaId, tipo);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", multimedia);
            logger.info("Subida completada exitosamente - ID: {}", multimedia.getId());
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            logger.error("Error de IO durante la subida: {}", e.getMessage(), e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Error al procesar el archivo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        } catch (RuntimeException e) {
            logger.error("Error de runtime durante la subida: {}", e.getMessage(), e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            logger.error("Error interno durante la subida: {}", e.getMessage(), e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Error interno del servidor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    private boolean isValidFileType(String contentType) {
        if (contentType == null) return false;
        
        // Tipos permitidos
        return contentType.startsWith("image/") ||
               contentType.startsWith("video/") ||
               contentType.startsWith("audio/") ||
               contentType.equals("application/pdf") ||
               contentType.equals("application/msword") ||
               contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
               contentType.equals("text/plain");
    }

    private String detectFileType(String contentType) {
        if (contentType == null) return "documento";

        String lowerContentType = contentType.toLowerCase();
        
        // Detectar por MIME type
        if (lowerContentType.startsWith("image/")) {
            return "imagen";
        } else if (lowerContentType.startsWith("video/")) {
            return "video";
        } else if (lowerContentType.startsWith("audio/")) {
            return "audio";
        } else if (lowerContentType.equals("application/pdf") ||
                   lowerContentType.equals("application/msword") ||
                   lowerContentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                   lowerContentType.equals("text/plain")) {
            return "documento";
        }
        
        return "documento";
    }
    
    // Detectar tipo de archivo por extensión como respaldo
    private String detectFileTypeByExtension(String filename) {
        if (filename == null) return "documento";
        
        String lowerFilename = filename.toLowerCase();
        
        // Imágenes
        if (lowerFilename.endsWith(".jpg") || lowerFilename.endsWith(".jpeg") ||
            lowerFilename.endsWith(".png") || lowerFilename.endsWith(".gif") ||
            lowerFilename.endsWith(".webp") || lowerFilename.endsWith(".bmp") ||
            lowerFilename.endsWith(".svg")) {
            return "imagen";
        }
        // Videos
        else if (lowerFilename.endsWith(".mp4") || lowerFilename.endsWith(".webm") ||
                 lowerFilename.endsWith(".ogg") || lowerFilename.endsWith(".avi") ||
                 lowerFilename.endsWith(".mov") || lowerFilename.endsWith(".wmv") ||
                 lowerFilename.endsWith(".flv") || lowerFilename.endsWith(".mkv")) {
            return "video";
        }
        // Audio
        else if (lowerFilename.endsWith(".mp3") || lowerFilename.endsWith(".wav") ||
                 lowerFilename.endsWith(".ogg") || lowerFilename.endsWith(".aac") ||
                 lowerFilename.endsWith(".flac") || lowerFilename.endsWith(".m4a")) {
            return "audio";
        }
        // Documentos
        else if (lowerFilename.endsWith(".pdf") || lowerFilename.endsWith(".doc") ||
                 lowerFilename.endsWith(".docx") || lowerFilename.endsWith(".txt") ||
                 lowerFilename.endsWith(".rtf") || lowerFilename.endsWith(".odt")) {
            return "documento";
        }
        
        return "documento";
    }
    
    // Detectar tipo de archivo por magic bytes (primeros bytes del archivo)
    private String detectFileTypeByMagicBytes(InputStream inputStream) throws IOException {
        byte[] buffer = new byte[12]; // Leer primeros 12 bytes
        int bytesRead = inputStream.read(buffer);
        if (bytesRead < 4) return "documento";
        
        // Convertir a hex para análisis
        StringBuilder hex = new StringBuilder();
        for (int i = 0; i < bytesRead; i++) {
            hex.append(String.format("%02x", buffer[i]));
        }
        
        String hexString = hex.toString();
        
        // Magic bytes para diferentes tipos de archivo
        if (hexString.startsWith("ffd8ff")) { // JPEG
            return "imagen";
        } else if (hexString.startsWith("89504e47")) { // PNG
            return "imagen";
        } else if (hexString.startsWith("47494638")) { // GIF
            return "imagen";
        } else if (hexString.startsWith("52494646") && hexString.contains("57454250")) { // WebP
            return "imagen";
        } else if (hexString.startsWith("0000001c667479706d703432")) { // MP4
            return "video";
        } else if (hexString.startsWith("1a45dfa3")) { // WebM
            return "video";
        } else if (hexString.startsWith("fffb") || hexString.startsWith("fff3") || hexString.startsWith("fffa")) { // MP3
            return "audio";
        } else if (hexString.startsWith("25504446")) { // PDF
            return "documento";
        }
        
        return "documento";
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

    // Endpoint para servir archivos multimedia
    @GetMapping("/file/{id}")
    public ResponseEntity<Resource> serveFile(@PathVariable Long id) {
        try {
            MultimediaItem multimedia = multimediaService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Archivo no encontrado con id: " + id));
            
            String filePath = multimedia.getUrlArchivo();
            if (filePath == null || filePath.isEmpty()) {
                throw new RuntimeException("Ruta de archivo no válida");
            }
            
            // Construir ruta completa del archivo
            Path path = Paths.get(filePath.startsWith("/") ? filePath.substring(1) : filePath);
            if (!Files.exists(path)) {
                throw new RuntimeException("Archivo no existe en el servidor");
            }
            
            @SuppressWarnings("null")
            Resource resource = new FileSystemResource(path);
            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("Archivo no se puede leer");
            }
            
            // Detectar tipo de contenido
            String contentType = "application/octet-stream";
            try {
                contentType = Files.probeContentType(path);
                if (contentType == null) {
                    contentType = multimedia.getTipo() != null ? 
                        getContentTypeFromTipo(multimedia.getTipo()) : 
                        "application/octet-stream";
                }
            } catch (Exception e) {
                contentType = multimedia.getTipo() != null ? 
                    getContentTypeFromTipo(multimedia.getTipo()) : 
                    "application/octet-stream";
            }
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + multimedia.getNombreArchivo() + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
                    
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Método principal de detección que combina múltiples técnicas
    private String detectFileTypeAdvanced(String contentType, String filename, InputStream inputStream) {
        try {
            // 1. Si tenemos InputStream, intentar detección por magic bytes (más confiable)
            if (inputStream != null) {
                String magicBytesType = detectFileTypeByMagicBytes(inputStream);
                if (!"documento".equals(magicBytesType)) {
                    return magicBytesType;
                }
            }
            
            // 2. Intentar detección por MIME type
            String mimeType = detectFileType(contentType);
            if (!"documento".equals(mimeType)) {
                return mimeType;
            }
            
            // 3. Fallback a detección por extensión
            String extensionType = detectFileTypeByExtension(filename);
            return extensionType;
            
        } catch (Exception e) {
            // En caso de error, usar detección por extensión como último recurso
            return detectFileTypeByExtension(filename);
        }
    }
    
    private String getContentTypeFromTipo(String tipo) {
        switch (tipo.toLowerCase()) {
            case "imagen":
                return "image/jpeg";
            case "video":
                return "video/mp4";
            case "audio":
                return "audio/mpeg";
            case "documento":
                return "application/pdf";
            default:
                return "application/octet-stream";
        }
    }
}