package com.backendeva.backend.dto;

import java.time.LocalDateTime;

public class ActividadRecienteDto {
    private Long id;
    private String tipo; // "usuario", "curso", "cuestionario"
    private String descripcion;
    private LocalDateTime fecha;

    // Constructor, Getters y Setters
    public ActividadRecienteDto(Long id, String tipo, String descripcion, LocalDateTime fecha) {
        this.id = id;
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.fecha = fecha;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }
}