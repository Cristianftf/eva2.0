package com.backendeva.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticasEstudianteDto {
    private int cursosInscritos;
    private int cursosCompletados;
    private int progresoPromedio;
    private int horasEstudio;
}