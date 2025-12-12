package com.backendeva.backend.dto;

import java.time.LocalDateTime;

/**
 * DTO para contenido educativo de Competencia Informacional
 */
public class ContenidoEducativoDto {
    
    private Long id;
    private String titulo;
    private String descripcion;
    private String tipoContenido;
    private String contenidoHtml;
    private String ejemplos;
    private String ejercicios;
    private Integer orden;
    private Boolean activo;
    private String nivelDificultad;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private Long cursoId;
    private String cursoTitulo;
    
    // Constructores
    public ContenidoEducativoDto() {}
    
    public ContenidoEducativoDto(Long id, String titulo, String descripcion, String tipoContenido,
                                String contenidoHtml, String ejemplos, String ejercicios, Integer orden,
                                Boolean activo, String nivelDificultad, LocalDateTime fechaCreacion,
                                LocalDateTime fechaActualizacion, Long cursoId, String cursoTitulo) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.tipoContenido = tipoContenido;
        this.contenidoHtml = contenidoHtml;
        this.ejemplos = ejemplos;
        this.ejercicios = ejercicios;
        this.orden = orden;
        this.activo = activo;
        this.nivelDificultad = nivelDificultad;
        this.fechaCreacion = fechaCreacion;
        this.fechaActualizacion = fechaActualizacion;
        this.cursoId = cursoId;
        this.cursoTitulo = cursoTitulo;
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public String getTipoContenido() {
        return tipoContenido;
    }
    
    public void setTipoContenido(String tipoContenido) {
        this.tipoContenido = tipoContenido;
    }
    
    public String getContenidoHtml() {
        return contenidoHtml;
    }
    
    public void setContenidoHtml(String contenidoHtml) {
        this.contenidoHtml = contenidoHtml;
    }
    
    public String getEjemplos() {
        return ejemplos;
    }
    
    public void setEjemplos(String ejemplos) {
        this.ejemplos = ejemplos;
    }
    
    public String getEjercicios() {
        return ejercicios;
    }
    
    public void setEjercicios(String ejercicios) {
        this.ejercicios = ejercicios;
    }
    
    public Integer getOrden() {
        return orden;
    }
    
    public void setOrden(Integer orden) {
        this.orden = orden;
    }
    
    public Boolean getActivo() {
        return activo;
    }
    
    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
    
    public String getNivelDificultad() {
        return nivelDificultad;
    }
    
    public void setNivelDificultad(String nivelDificultad) {
        this.nivelDificultad = nivelDificultad;
    }
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
    
    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }
    
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }
    
    public Long getCursoId() {
        return cursoId;
    }
    
    public void setCursoId(Long cursoId) {
        this.cursoId = cursoId;
    }
    
    public String getCursoTitulo() {
        return cursoTitulo;
    }
    
    public void setCursoTitulo(String cursoTitulo) {
        this.cursoTitulo = cursoTitulo;
    }
    
    // Métodos de utilidad
    public boolean isOperadoresBooleanos() {
        return "OPERADORES_BOOLEANOS".equals(tipoContenido);
    }
    
    public boolean isCraap() {
        return "CRAAP".equals(tipoContenido);
    }
    
    public boolean isMotoresBusqueda() {
        return "MOTORES_BUSQUEDA".equals(tipoContenido);
    }
    
    public boolean isTruncamientos() {
        return "TRUNCAMIENTOS".equals(tipoContenido);
    }
    
    public boolean isBasico() {
        return "BASICO".equals(nivelDificultad);
    }
    
    public boolean isIntermedio() {
        return "INTERMEDIO".equals(nivelDificultad);
    }
    
    public boolean isAvanzado() {
        return "AVANZADO".equals(nivelDificultad);
    }
    
    public String getTipoContenidoDisplay() {
        switch (tipoContenido) {
            case "OPERADORES_BOOLEANOS":
                return "Operadores Booleanos";
            case "CRAAP":
                return "Evaluación CRAAP";
            case "MOTORES_BUSQUEDA":
                return "Motores de Búsqueda";
            case "TRUNCAMIENTOS":
                return "Truncamientos y Comodines";
            case "BASES_DATOS_CIENTIFICAS":
                return "Bases de Datos Científicas";
            default:
                return tipoContenido;
        }
    }
    
    public String getNivelDificultadDisplay() {
        switch (nivelDificultad) {
            case "BASICO":
                return "Básico";
            case "INTERMEDIO":
                return "Intermedio";
            case "AVANZADO":
                return "Avanzado";
            default:
                return nivelDificultad;
        }
    }
}