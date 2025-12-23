package com.backendeva.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String nombre;
    private String apellido;
    private String rol;
    private String fotoPerfil;
    private LocalDate fechaRegistro;
    private boolean activo;
}