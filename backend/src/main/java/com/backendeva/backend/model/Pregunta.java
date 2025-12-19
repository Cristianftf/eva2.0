package com.backendeva.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "preguntas")
@Getter
@Setter
public class Pregunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String textoPregunta;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoPregunta tipoPregunta = TipoPregunta.OPCION_MULTIPLE;

    @Column(columnDefinition = "TEXT")
    private String configuracionAdicional; // JSON con configuración específica del tipo

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cuestionario_id", nullable = false)
    @JsonBackReference
    private Cuestionario cuestionario;

    @OneToMany(mappedBy = "pregunta", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Respuesta> respuestas;

    /**
     * Constructor por defecto
     */
    public Pregunta() {
        this.tipoPregunta = TipoPregunta.OPCION_MULTIPLE;
    }

    /**
     * Constructor con parámetros básicos
     */
    public Pregunta(String textoPregunta, TipoPregunta tipoPregunta) {
        this.textoPregunta = textoPregunta;
        this.tipoPregunta = tipoPregunta;
    }

    /**
     * Valida que la pregunta tenga una configuración válida según su tipo
     * @return true si la configuración es válida
     */
    public boolean esConfiguracionValida() {
        switch (tipoPregunta) {
            case OPCION_MULTIPLE:
            case VERDADERO_FALSO:
                return respuestas != null && respuestas.size() >= 2;
            case COMPLETAR_TEXTO:
            case RESPUESTA_CORTA:
                return true; // Las preguntas de texto pueden tener 0 o más respuestas de referencia
            case ARRASTRAR_SOLTAR:
            case ORDENAR_ELEMENTOS:
                return configuracionAdicional != null && !configuracionAdicional.trim().isEmpty();
            default:
                return false;
        }
    }

    /**
     * Obtiene el número máximo de respuestas permitidas para este tipo de pregunta
     * @return Número máximo de respuestas
     */
    public int getMaximoRespuestas() {
        return tipoPregunta != null ? tipoPregunta.getMaximoRespuestas() : 5;
    }

    /**
     * Verifica si la pregunta requiere configuración adicional
     * @return true si requiere configuración especial
     */
    public boolean requiereConfiguracionAdicional() {
        return tipoPregunta != null && tipoPregunta.requiereConfiguracionAdicional();
    }
}