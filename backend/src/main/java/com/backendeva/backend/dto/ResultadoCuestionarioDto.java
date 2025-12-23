package com.backendeva.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResultadoCuestionarioDto {
    private Long id;
    private String curso;
    private String cuestionario;
    private int calificacion;
    private LocalDateTime fecha;
    private String estado;
}