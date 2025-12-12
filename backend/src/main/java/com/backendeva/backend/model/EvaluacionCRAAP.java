package com.backendeva.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Modelo para evaluaciones CRAAP (Currency, Relevance, Authority, Accuracy, Purpose)
 */
@Entity
@Table(name = "evaluacion_craap")
public class EvaluacionCRAAP {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String tituloFuente;
    
    @Column(columnDefinition = "TEXT")
    private String urlFuente;
    
    @Column(columnDefinition = "TEXT")
    private String descripcionFuente;
    
    @Column
    private String tipoFuente; // ARTICULO, LIBRO, WEB, VIDEO, etc.
    
    // Currency (Actualidad)
    @Column
    private Integer currencyPuntuacion; // 1-5
    @Column(columnDefinition = "TEXT")
    private String currencyComentario;
    @Column
    private LocalDateTime fechaPublicacion;
    @Column
    private LocalDateTime fechaUltimaActualizacion;
    
    // Relevance (Relevancia)
    @Column
    private Integer relevancePuntuacion; // 1-5
    @Column(columnDefinition = "TEXT")
    private String relevanceComentario;
    @Column
    private String nivelRelevancia; // ALTA, MEDIA, BAJA
    
    // Authority (Autoridad)
    @Column
    private Integer authorityPuntuacion; // 1-5
    @Column(columnDefinition = "TEXT")
    private String authorityComentario;
    @Column(columnDefinition = "TEXT")
    private String autorInstitucion;
    @Column
    private String credencialesAutor;
    @Column
    private Boolean esAutorExperto;
    
    // Accuracy (Precisión)
    @Column
    private Integer accuracyPuntuacion; // 1-5
    @Column(columnDefinition = "TEXT")
    private String accuracyComentario;
    @Column
    private Boolean tieneReferencias;
    @Column
    private Integer numeroReferencias;
    @Column
    private Boolean esRevisionPar;
    @Column
    private Boolean hayErroresDetectados;
    
    // Purpose (Propósito)
    @Column
    private Integer purposePuntuacion; // 1-5
    @Column(columnDefinition = "TEXT")
    private String purposeComentario;
    @Column
    private String proposito; // INFORMAR, PERSUADIR, VENDER, ENTRETENER, ACADEMICO
    @Column
    private Boolean tieneSesgo;
    @Column
    private String tipoSesgo;
    
    // Puntuación total y resultado
    @Column
    private Double puntuacionTotal;
    @Column
    private String conclusion; // EXCELENTE, BUENA, ACEPTABLE, POBRE, NO RECOMENDADA
    @Column(columnDefinition = "TEXT")
    private String recomendaciones;
    
    @Column
    private LocalDateTime fechaEvaluacion;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User evaluador;
    
    @PrePersist
    protected void onCreate() {
        fechaEvaluacion = LocalDateTime.now();
        calcularPuntuacionTotal();
        generarConclusion();
    }
    
    @PreUpdate
    protected void onUpdate() {
        calcularPuntuacionTotal();
        generarConclusion();
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTituloFuente() {
        return tituloFuente;
    }
    
    public void setTituloFuente(String tituloFuente) {
        this.tituloFuente = tituloFuente;
    }
    
    public String getUrlFuente() {
        return urlFuente;
    }
    
    public void setUrlFuente(String urlFuente) {
        this.urlFuente = urlFuente;
    }
    
    public String getDescripcionFuente() {
        return descripcionFuente;
    }
    
    public void setDescripcionFuente(String descripcionFuente) {
        this.descripcionFuente = descripcionFuente;
    }
    
    public String getTipoFuente() {
        return tipoFuente;
    }
    
    public void setTipoFuente(String tipoFuente) {
        this.tipoFuente = tipoFuente;
    }
    
    public Integer getCurrencyPuntuacion() {
        return currencyPuntuacion;
    }
    
    public void setCurrencyPuntuacion(Integer currencyPuntuacion) {
        this.currencyPuntuacion = currencyPuntuacion;
        calcularPuntuacionTotal();
    }
    
    public String getCurrencyComentario() {
        return currencyComentario;
    }
    
    public void setCurrencyComentario(String currencyComentario) {
        this.currencyComentario = currencyComentario;
    }
    
    public LocalDateTime getFechaPublicacion() {
        return fechaPublicacion;
    }
    
    public void setFechaPublicacion(LocalDateTime fechaPublicacion) {
        this.fechaPublicacion = fechaPublicacion;
    }
    
    public LocalDateTime getFechaUltimaActualizacion() {
        return fechaUltimaActualizacion;
    }
    
    public void setFechaUltimaActualizacion(LocalDateTime fechaUltimaActualizacion) {
        this.fechaUltimaActualizacion = fechaUltimaActualizacion;
    }
    
    public Integer getRelevancePuntuacion() {
        return relevancePuntuacion;
    }
    
    public void setRelevancePuntuacion(Integer relevancePuntuacion) {
        this.relevancePuntuacion = relevancePuntuacion;
        calcularPuntuacionTotal();
    }
    
    public String getRelevanceComentario() {
        return relevanceComentario;
    }
    
    public void setRelevanceComentario(String relevanceComentario) {
        this.relevanceComentario = relevanceComentario;
    }
    
    public String getNivelRelevancia() {
        return nivelRelevancia;
    }
    
    public void setNivelRelevancia(String nivelRelevancia) {
        this.nivelRelevancia = nivelRelevancia;
    }
    
    public Integer getAuthorityPuntuacion() {
        return authorityPuntuacion;
    }
    
    public void setAuthorityPuntuacion(Integer authorityPuntuacion) {
        this.authorityPuntuacion = authorityPuntuacion;
        calcularPuntuacionTotal();
    }
    
    public String getAuthorityComentario() {
        return authorityComentario;
    }
    
    public void setAuthorityComentario(String authorityComentario) {
        this.authorityComentario = authorityComentario;
    }
    
    public String getAutorInstitucion() {
        return autorInstitucion;
    }
    
    public void setAutorInstitucion(String autorInstitucion) {
        this.autorInstitucion = autorInstitucion;
    }
    
    public String getCredencialesAutor() {
        return credencialesAutor;
    }
    
    public void setCredencialesAutor(String credencialesAutor) {
        this.credencialesAutor = credencialesAutor;
    }
    
    public Boolean getEsAutorExperto() {
        return esAutorExperto;
    }
    
    public void setEsAutorExperto(Boolean esAutorExperto) {
        this.esAutorExperto = esAutorExperto;
    }
    
    public Integer getAccuracyPuntuacion() {
        return accuracyPuntuacion;
    }
    
    public void setAccuracyPuntuacion(Integer accuracyPuntuacion) {
        this.accuracyPuntuacion = accuracyPuntuacion;
        calcularPuntuacionTotal();
    }
    
    public String getAccuracyComentario() {
        return accuracyComentario;
    }
    
    public void setAccuracyComentario(String accuracyComentario) {
        this.accuracyComentario = accuracyComentario;
    }
    
    public Boolean getTieneReferencias() {
        return tieneReferencias;
    }
    
    public void setTieneReferencias(Boolean tieneReferencias) {
        this.tieneReferencias = tieneReferencias;
    }
    
    public Integer getNumeroReferencias() {
        return numeroReferencias;
    }
    
    public void setNumeroReferencias(Integer numeroReferencias) {
        this.numeroReferencias = numeroReferencias;
    }
    
    public Boolean getEsRevisionPar() {
        return esRevisionPar;
    }
    
    public void setEsRevisionPar(Boolean esRevisionPar) {
        this.esRevisionPar = esRevisionPar;
    }
    
    public Boolean getHayErroresDetectados() {
        return hayErroresDetectados;
    }
    
    public void setHayErroresDetectados(Boolean hayErroresDetectados) {
        this.hayErroresDetectados = hayErroresDetectados;
    }
    
    public Integer getPurposePuntuacion() {
        return purposePuntuacion;
    }
    
    public void setPurposePuntuacion(Integer purposePuntuacion) {
        this.purposePuntuacion = purposePuntuacion;
        calcularPuntuacionTotal();
    }
    
    public String getPurposeComentario() {
        return purposeComentario;
    }
    
    public void setPurposeComentario(String purposeComentario) {
        this.purposeComentario = purposeComentario;
    }
    
    public String getProposito() {
        return proposito;
    }
    
    public void setProposito(String proposito) {
        this.proposito = proposito;
    }
    
    public Boolean getTieneSesgo() {
        return tieneSesgo;
    }
    
    public void setTieneSesgo(Boolean tieneSesgo) {
        this.tieneSesgo = tieneSesgo;
    }
    
    public String getTipoSesgo() {
        return tipoSesgo;
    }
    
    public void setTipoSesgo(String tipoSesgo) {
        this.tipoSesgo = tipoSesgo;
    }
    
    public Double getPuntuacionTotal() {
        return puntuacionTotal;
    }
    
    public String getConclusion() {
        return conclusion;
    }
    
    public String getRecomendaciones() {
        return recomendaciones;
    }
    
    public void setRecomendaciones(String recomendaciones) {
        this.recomendaciones = recomendaciones;
    }
    
    public LocalDateTime getFechaEvaluacion() {
        return fechaEvaluacion;
    }
    
    public void setFechaEvaluacion(LocalDateTime fechaEvaluacion) {
        this.fechaEvaluacion = fechaEvaluacion;
    }
    
    public User getEvaluador() {
        return evaluador;
    }
    
    public void setEvaluador(User evaluador) {
        this.evaluador = evaluador;
    }
    
    // Métodos de cálculo
    public void calcularPuntuacionTotal() {
        int suma = 0;
        int count = 0;
        
        if (currencyPuntuacion != null) { suma += currencyPuntuacion; count++; }
        if (relevancePuntuacion != null) { suma += relevancePuntuacion; count++; }
        if (authorityPuntuacion != null) { suma += authorityPuntuacion; count++; }
        if (accuracyPuntuacion != null) { suma += accuracyPuntuacion; count++; }
        if (purposePuntuacion != null) { suma += purposePuntuacion; count++; }
        
        this.puntuacionTotal = count > 0 ? (double) suma / count : 0.0;
    }
    
    public void generarConclusion() {
        if (puntuacionTotal == null) return;
        
        if (puntuacionTotal >= 4.5) {
            this.conclusion = "EXCELENTE";
        } else if (puntuacionTotal >= 3.5) {
            this.conclusion = "BUENA";
        } else if (puntuacionTotal >= 2.5) {
            this.conclusion = "ACEPTABLE";
        } else if (puntuacionTotal >= 1.5) {
            this.conclusion = "POBRE";
        } else {
            this.conclusion = "NO RECOMENDADA";
        }
    }
    
    // Constantes
    public static final String TIPO_ARTICULO = "ARTICULO";
    public static final String TIPO_LIBRO = "LIBRO";
    public static final String TIPO_WEB = "WEB";
    public static final String TIPO_VIDEO = "VIDEO";
    public static final String TIPO_CONFERENCIA = "CONFERENCIA";
    
    public static final String PROPOSITO_INFORMAR = "INFORMAR";
    public static final String PROPOSITO_PERSUADIR = "PERSUADIR";
    public static final String PROPOSITO_VENDER = "VENDER";
    public static final String PROPOSITO_ENTRETENER = "ENTRETENER";
    public static final String PROPOSITO_ACADEMICO = "ACADEMICO";
    
    public static final String NIVEL_RELEVANCIA_ALTA = "ALTA";
    public static final String NIVEL_RELEVANCIA_MEDIA = "MEDIA";
    public static final String NIVEL_RELEVANCIA_BAJA = "BAJA";
    
    public static final String SESGO_POLITICO = "POLITICO";
    public static final String SESGO_COMERCIAL = "COMERCIAL";
    public static final String SESGO_RELIGIOSO = "RELIGIOSO";
    public static final String SESGO_IDEOLOGICO = "IDEOLOGICO";
}