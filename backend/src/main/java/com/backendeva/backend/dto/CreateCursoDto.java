package com.backendeva.backend.dto;

import java.math.BigDecimal;

public class CreateCursoDto {
    private String titulo;
    private String descripcion;
    private String objetivos;
    private Integer duracionEstimada;
    private String nivel;
    private String categoria;
    private String profesorId;
    private boolean activo;
    private String metadataLom;

    // Nuevos campos para cursos enriquecidos
    private String prerrequisitos;
    private String resultadosAprendizaje;
    private String habilidades;
    private String idioma;
    private BigDecimal precio;
    private String imagenPortada;
    private String etiquetas;

    // Constructors
    public CreateCursoDto() {}

    public CreateCursoDto(String titulo, String descripcion, String objetivos, Integer duracionEstimada, String nivel, String categoria, String profesorId, boolean activo) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.objetivos = objetivos;
        this.duracionEstimada = duracionEstimada;
        this.nivel = nivel;
        this.categoria = categoria;
        this.profesorId = profesorId;
        this.activo = activo;
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

    public String getObjetivos() {
        return objetivos;
    }

    public void setObjetivos(String objetivos) {
        this.objetivos = objetivos;
    }

    public Integer getDuracionEstimada() {
        return duracionEstimada;
    }

    public void setDuracionEstimada(Integer duracionEstimada) {
        this.duracionEstimada = duracionEstimada;
    }

    public String getNivel() {
        return nivel;
    }

    public void setNivel(String nivel) {
        this.nivel = nivel;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getProfesorId() {
        return profesorId;
    }

    public void setProfesorId(String profesorId) {
        this.profesorId = profesorId;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public String getMetadataLom() {
        return metadataLom;
    }

    public void setMetadataLom(String metadataLom) {
        this.metadataLom = metadataLom;
    }

    // Getters and Setters for new fields
    public String getPrerrequisitos() {
        return prerrequisitos;
    }

    public void setPrerrequisitos(String prerrequisitos) {
        this.prerrequisitos = prerrequisitos;
    }

    public String getResultadosAprendizaje() {
        return resultadosAprendizaje;
    }

    public void setResultadosAprendizaje(String resultadosAprendizaje) {
        this.resultadosAprendizaje = resultadosAprendizaje;
    }

    public String getHabilidades() {
        return habilidades;
    }

    public void setHabilidades(String habilidades) {
        this.habilidades = habilidades;
    }

    public String getIdioma() {
        return idioma;
    }

    public void setIdioma(String idioma) {
        this.idioma = idioma;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public String getImagenPortada() {
        return imagenPortada;
    }

    public void setImagenPortada(String imagenPortada) {
        this.imagenPortada = imagenPortada;
    }

    public String getEtiquetas() {
        return etiquetas;
    }

    public void setEtiquetas(String etiquetas) {
        this.etiquetas = etiquetas;
    }
}