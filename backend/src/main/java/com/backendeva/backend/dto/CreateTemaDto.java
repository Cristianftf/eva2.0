package com.backendeva.backend.dto;

public class CreateTemaDto {
    private String titulo;
    private String descripcion;
    private Integer orden;
    private String cursoId;

    // Constructors
    public CreateTemaDto() {}

    public CreateTemaDto(String titulo, String descripcion, Integer orden, String cursoId) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.orden = orden;
        this.cursoId = cursoId;
    }

    // Getters and Setters
    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getOrden() {
        return orden;
    }

    public void setOrden(Integer orden) {
        this.orden = orden;
    }

    public String getCursoId() {
        return cursoId;
    }

    public void setCursoId(String cursoId) {
        this.cursoId = cursoId;
    }
}