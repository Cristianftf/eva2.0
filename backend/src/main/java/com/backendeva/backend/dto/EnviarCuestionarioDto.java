package com.backendeva.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EnviarCuestionarioDto {
    private List<RespuestaEstudianteDto> respuestas;
    private String estudianteId;
}
