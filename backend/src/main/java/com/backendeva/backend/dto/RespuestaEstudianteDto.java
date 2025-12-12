package com.backendeva.backend.dto;

import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.databind.JsonNode;

@Getter
@Setter
public class RespuestaEstudianteDto {
    private Integer preguntaId;
    // La respuesta puede ser de diferentes tipos según la pregunta
    private JsonNode respuesta; // Usamos JsonNode para manejar diferentes tipos de respuesta
}
