package com.backendeva.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Modelo para simulaciones de búsqueda académica con operadores booleanos
 */
@Entity
@Table(name = "simulacion_busqueda")
public class SimulacionBusqueda {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(nullable = false)
    private String consultaUsuario;
    
    @Column(columnDefinition = "TEXT")
    private String consultaParsed;
    
    @Column(columnDefinition = "TEXT")
    private String retroalimentacion;
    
    @Column
    private Double puntuacion;
    
    @Column
    private Integer tiempoSegundos;
    
    @Column
    private LocalDateTime fechaSimulacion;
    
    @Column
    private String nivelDificultad; // BASICO, INTERMEDIO, AVANZADO
    
    @Column
    private String categoria; // MEDICINA, TECNOLOGIA, EDUCACION, PSICOLOGIA, etc.
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User usuario;
    
    @OneToMany(mappedBy = "simulacion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResultadoSimulacion> resultados;
    
    @Column
    private Integer totalResultados;
    
    @Column
    private Integer resultadosRelevantes;
    
    @Column(columnDefinition = "TEXT")
    private String operadoresDetectados;
    
    @PrePersist
    protected void onCreate() {
        fechaSimulacion = LocalDateTime.now();
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
    
    public String getConsultaUsuario() {
        return consultaUsuario;
    }
    
    public void setConsultaUsuario(String consultaUsuario) {
        this.consultaUsuario = consultaUsuario;
    }
    
    public String getConsultaParsed() {
        return consultaParsed;
    }
    
    public void setConsultaParsed(String consultaParsed) {
        this.consultaParsed = consultaParsed;
    }
    
    public String getRetroalimentacion() {
        return retroalimentacion;
    }
    
    public void setRetroalimentacion(String retroalimentacion) {
        this.retroalimentacion = retroalimentacion;
    }
    
    public Double getPuntuacion() {
        return puntuacion;
    }
    
    public void setPuntuacion(Double puntuacion) {
        this.puntuacion = puntuacion;
    }
    
    public Integer getTiempoSegundos() {
        return tiempoSegundos;
    }
    
    public void setTiempoSegundos(Integer tiempoSegundos) {
        this.tiempoSegundos = tiempoSegundos;
    }
    
    public LocalDateTime getFechaSimulacion() {
        return fechaSimulacion;
    }
    
    public void setFechaSimulacion(LocalDateTime fechaSimulacion) {
        this.fechaSimulacion = fechaSimulacion;
    }
    
    public String getNivelDificultad() {
        return nivelDificultad;
    }
    
    public void setNivelDificultad(String nivelDificultad) {
        this.nivelDificultad = nivelDificultad;
    }
    
    public String getCategoria() {
        return categoria;
    }
    
    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
    
    public User getUsuario() {
        return usuario;
    }
    
    public void setUsuario(User usuario) {
        this.usuario = usuario;
    }
    
    public List<ResultadoSimulacion> getResultados() {
        return resultados;
    }
    
    public void setResultados(List<ResultadoSimulacion> resultados) {
        this.resultados = resultados;
    }
    
    public Integer getTotalResultados() {
        return totalResultados;
    }
    
    public void setTotalResultados(Integer totalResultados) {
        this.totalResultados = totalResultados;
    }
    
    public Integer getResultadosRelevantes() {
        return resultadosRelevantes;
    }
    
    public void setResultadosRelevantes(Integer resultadosRelevantes) {
        this.resultadosRelevantes = resultadosRelevantes;
    }
    
    public String getOperadoresDetectados() {
        return operadoresDetectados;
    }
    
    public void setOperadoresDetectados(String operadoresDetectados) {
        this.operadoresDetectados = operadoresDetectados;
    }
    
    // Constantes para niveles
    public static final String NIVEL_BASICO = "BASICO";
    public static final String NIVEL_INTERMEDIO = "INTERMEDIO";
    public static final String NIVEL_AVANZADO = "AVANZADO";
    
    // Constantes para categorías
    public static final String CATEGORIA_MEDICINA = "MEDICINA";
    public static final String CATEGORIA_TECNOLOGIA = "TECNOLOGIA";
    public static final String CATEGORIA_EDUCACION = "EDUCACION";
    public static final String CATEGORIA_PSICOLOGIA = "PSICOLOGIA";
    public static final String CATEGORIA_CIENCIAS_SOCIALES = "CIENCIAS_SOCIALES";
    public static final String CATEGORIA_NATURALES = "CIENCIAS_NATURALES";
}