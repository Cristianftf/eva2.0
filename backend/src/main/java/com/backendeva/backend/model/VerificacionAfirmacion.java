package com.backendeva.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Modelo para almacenar verificaciones de afirmaciones de salud
 * Implementa RF3: Evaluación de Veracidad de Afirmaciones de Salud
 */
@Entity
@Table(name = "verificacion_afirmacion")
@Getter
@Setter
public class VerificacionAfirmacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Afirmación ingresada por el estudiante
    @Column(columnDefinition = "TEXT", nullable = false)
    private String afirmacion;

    // Puntaje de veracidad (0-100)
    @Column(nullable = false)
    private Double puntajeVeracidad;

    // Nivel de veracidad: ALTA, MEDIA, BAJA
    @Column(nullable = false)
    private String nivelVeracidad;

    // Similitud de coseno promedio con el corpus
    @Column(nullable = false)
    private Double similitudCoseno;

    // Stance detection: SUPPORTS, CONTRADICTS, NEUTRAL
    @Column(nullable = false)
    private String stanceDetection;

    // Número de fuentes que apoyan la afirmación
    private Integer fuentesApoyo;

    // Número de fuentes que contradicen la afirmación
    private Integer fuentesContradiccion;

    // Número de fuentes neutrales
    private Integer fuentesNeutrales;

    // Total de fuentes analizadas
    private Integer totalFuentesAnalizadas;

    // Explicación detallada del resultado
    @Column(columnDefinition = "TEXT")
    private String explicacion;

    // Recomendaciones para el estudiante
    @Column(columnDefinition = "TEXT")
    private String recomendaciones;

    // Categoría de salud (MEDICINA, NUTRICION, PSICOLOGIA, etc.)
    private String categoria;

    // Usuario que realizó la verificación
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private User usuario;

    // Fecha de la verificación
    @Column(nullable = false)
    private LocalDateTime fechaVerificacion;

    // Fuentes relevantes encontradas (JSON serializado)
    @Column(columnDefinition = "TEXT")
    private String fuentesRelevantes;

    // Términos clave extraídos de la afirmación
    @Column(columnDefinition = "TEXT")
    private String terminosClave;

    // Constantes para niveles de veracidad
    public static final String NIVEL_ALTA = "ALTA";
    public static final String NIVEL_MEDIA = "MEDIA";
    public static final String NIVEL_BAJA = "BAJA";

    // Constantes para stance detection
    public static final String STANCE_SUPPORTS = "SUPPORTS";
    public static final String STANCE_CONTRADICTS = "CONTRADICTS";
    public static final String STANCE_NEUTRAL = "NEUTRAL";

    // Constantes para categorías
    public static final String CATEGORIA_MEDICINA = "MEDICINA";
    public static final String CATEGORIA_NUTRICION = "NUTRICION";
    public static final String CATEGORIA_PSICOLOGIA = "PSICOLOGIA";
    public static final String CATEGORIA_FARMACOLOGIA = "FARMACOLOGIA";
    public static final String CATEGORIA_EPIDEMIOLOGIA = "EPIDEMIOLOGIA";
    public static final String CATEGORIA_GENERAL = "GENERAL";

    @PrePersist
    protected void onCreate() {
        if (fechaVerificacion == null) {
            fechaVerificacion = LocalDateTime.now();
        }
    }

    /**
     * Calcula el nivel de veracidad basado en similitud y stance
     * Umbral pedagógico según RF3:
     * - Si similitud > 0.75 Y stance = "supports" → veracidad = Alta
     * - Si 0.50-0.75 Y stance = "neutral" → veracidad = Media
     * - Si < 0.50 O stance = "contradicts" → veracidad = Baja
     */
    public void calcularNivelVeracidad() {
        if (similitudCoseno == null || stanceDetection == null) {
            this.nivelVeracidad = NIVEL_BAJA;
            this.puntajeVeracidad = 0.0;
            return;
        }

        if (similitudCoseno > 0.75 && STANCE_SUPPORTS.equals(stanceDetection)) {
            this.nivelVeracidad = NIVEL_ALTA;
            this.puntajeVeracidad = Math.min(100.0, similitudCoseno * 100 + 10);
        } else if (similitudCoseno >= 0.50 && similitudCoseno <= 0.75 && STANCE_NEUTRAL.equals(stanceDetection)) {
            this.nivelVeracidad = NIVEL_MEDIA;
            this.puntajeVeracidad = similitudCoseno * 100;
        } else if (similitudCoseno < 0.50 || STANCE_CONTRADICTS.equals(stanceDetection)) {
            this.nivelVeracidad = NIVEL_BAJA;
            this.puntajeVeracidad = Math.max(0.0, similitudCoseno * 100 - 20);
        } else {
            // Caso por defecto
            this.nivelVeracidad = NIVEL_MEDIA;
            this.puntajeVeracidad = similitudCoseno * 100;
        }
    }
}
