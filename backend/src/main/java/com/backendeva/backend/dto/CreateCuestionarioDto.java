package com.backendeva.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// import java.util.List;

/**
 * DTO para la creación de cuestionarios
 * Incluye validación de campos requeridos
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateCuestionarioDto {
    
    private String titulo;
    private String descripcion;
    private Long cursoId;  // Campo requerido
    private Integer duracionMinutos;
    private Boolean activo = true;
    private String qtiPayload;
    
    // Validaciones manuales
    public boolean isValid() {
        return titulo != null && !titulo.trim().isEmpty() &&
               cursoId != null && cursoId > 0;
    }
    
    public String getValidationErrors() {
        StringBuilder errors = new StringBuilder();
        
        if (titulo == null || titulo.trim().isEmpty()) {
            errors.append("El título es requerido. ");
        }
        
        if (cursoId == null || cursoId <= 0) {
            errors.append("El ID del curso es requerido y debe ser válido. ");
        }
        
        return errors.toString().trim();
    }
}