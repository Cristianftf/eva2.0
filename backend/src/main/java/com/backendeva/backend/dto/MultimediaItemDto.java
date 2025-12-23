package com.backendeva.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MultimediaItemDto {
    private Long id;
    private String nombreArchivo;
    private String tipo;
    private String urlArchivo;
    private String urlSubtitulos;
    private String urlThumbnail;
    private Long tamanioBytes;
    private Integer duracionSegundos;
    private Long temaId;
    private LocalDateTime fechaSubida;
}