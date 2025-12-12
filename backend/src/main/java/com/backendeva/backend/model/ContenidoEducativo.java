package com.backendeva.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Modelo para contenido educativo específico de Competencia Informacional
 * Incluye módulos sobre operadores booleanos, criterios CRAAP, etc.
 */
@Entity
@Table(name = "contenido_educativo")
public class ContenidoEducativo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(nullable = false)
    private String tipoContenido; // OPERADORES_BOOLEANOS, CRAAP, MOTORES_BUSQUEDA, TRUNCAMIENTOS
    
    @Column(columnDefinition = "TEXT")
    private String contenidoHtml;
    
    @Column(columnDefinition = "TEXT")
    private String ejemplos;
    
    @Column(columnDefinition = "TEXT")
    private String ejercicios;
    
    @Column
    private Integer orden;
    
    @Column(nullable = false)
    private Boolean activo = true;
    
    @Column
    private String nivelDificultad; // BASICO, INTERMEDIO, AVANZADO
    
    @Column
    private LocalDateTime fechaCreacion;
    
    @Column
    private LocalDateTime fechaActualizacion;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id")
    private Curso curso;
    
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
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
    
    public Curso getCurso() {
        return curso;
    }
    
    public void setCurso(Curso curso) {
        this.curso = curso;
    }
    
    // Constantes para tipos de contenido
    public static final String OPERADORES_BOOLEANOS = "OPERADORES_BOOLEANOS";
    public static final String CRAAP = "CRAAP";
    public static final String MOTORES_BUSQUEDA = "MOTORES_BUSQUEDA";
    public static final String TRUNCAMIENTOS = "TRUNCAMIENTOS";
    public static final String BASES_DATOS_CIENTIFICAS = "BASES_DATOS_CIENTIFICAS";
    
    // Constantes para niveles
    public static final String NIVEL_BASICO = "BASICO";
    public static final String NIVEL_INTERMEDIO = "INTERMEDIO";
    public static final String NIVEL_AVANZADO = "AVANZADO";
}