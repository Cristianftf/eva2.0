package com.backendeva.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticasProfesorDto {
    private int misCursos;
    private int totalEstudiantes;
    private int cuestionariosCreados;
    private double promedioCalificaciones;
}