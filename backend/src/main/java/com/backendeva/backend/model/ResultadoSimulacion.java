package com.backendeva.backend.model;

import jakarta.persistence.*;
import java.util.List;

/**
 * Modelo para resultados de simulaciones de búsqueda
 */
@Entity
@Table(name = "resultado_simulacion")
public class ResultadoSimulacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(columnDefinition = "TEXT")
    private String autores;
    
    @Column
    private String fechaPublicacion;
    
    @Column
    private String fuente;
    
    @Column
    private Boolean relevante = false;
    
    @Column(columnDefinition = "TEXT")
    private String contenido;
    
    @Column(columnDefinition = "TEXT")
    private String terminosEncontrados;
    
    @Column
    private Double puntuacionRelevancia = 0.0;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "simulacion_id")
    private SimulacionBusqueda simulacion;
    
    @ElementCollection
    @CollectionTable(name = "resultado_terminos", joinColumns = @JoinColumn(name = "resultado_id"))
    @Column(name = "termino")
    private List<String> terminos;
    
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
    
    public String getAutores() {
        return autores;
    }
    
    public void setAutores(String autores) {
        this.autores = autores;
    }
    
    public String getFechaPublicacion() {
        return fechaPublicacion;
    }
    
    public void setFechaPublicacion(String fechaPublicacion) {
        this.fechaPublicacion = fechaPublicacion;
    }
    
    public String getFuente() {
        return fuente;
    }
    
    public void setFuente(String fuente) {
        this.fuente = fuente;
    }
    
    public Boolean getRelevante() {
        return relevante;
    }
    
    public void setRelevante(Boolean relevante) {
        this.relevante = relevante;
    }
    
    public String getContenido() {
        return contenido;
    }
    
    public void setContenido(String contenido) {
        this.contenido = contenido;
    }
    
    public String getTerminosEncontrados() {
        return terminosEncontrados;
    }
    
    public void setTerminosEncontrados(String terminosEncontrados) {
        this.terminosEncontrados = terminosEncontrados;
    }
    
    public Double getPuntuacionRelevancia() {
        return puntuacionRelevancia;
    }
    
    public void setPuntuacionRelevancia(Double puntuacionRelevancia) {
        this.puntuacionRelevancia = puntuacionRelevancia;
    }
    
    public SimulacionBusqueda getSimulacion() {
        return simulacion;
    }
    
    public void setSimulacion(SimulacionBusqueda simulacion) {
        this.simulacion = simulacion;
    }
    
    public List<String> getTerminos() {
        return terminos;
    }
    
    public void setTerminos(List<String> terminos) {
        this.terminos = terminos;
    }
}