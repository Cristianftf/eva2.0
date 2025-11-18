package com.backendeva.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterDto {
    private String email;
    private String password;
    private String nombre;
    private String apellido;
    private String rol;
}
