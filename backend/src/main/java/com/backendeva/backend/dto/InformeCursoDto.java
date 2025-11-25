package com.backendeva.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class InformeCursoDto {
    private Long id;
    private Long cursoId;
    private String cursoTitulo;
    private int totalEstudiantes;
    private double promedioProgreso;
    private double promedioCalificaciones;
    private LocalDateTime fechaGeneracion;
}