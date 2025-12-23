package com.backendeva.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "respuestas")
@Getter
@Setter
public class Respuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String textoRespuesta;

    @Column(nullable = false)
    private Boolean esCorrecta;

    // Campos adicionales para soportar tipos de pregunta complejos
    @Column(columnDefinition = "TEXT")
    private String valor; // Para preguntas de completar texto

    @Column
    private Integer orden; // Para preguntas de ordenar elementos

    @Column(columnDefinition = "TEXT")
    private String grupo; // Para preguntas de arrastrar y soltar (origen/destino)

    @Column(columnDefinition = "TEXT")
    private String configuracionAdicional; // JSON con configuración específica

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pregunta_id", nullable = false)
    @JsonBackReference
    private Pregunta pregunta;

    /**
     * Constructor por defecto
     */
    public Respuesta() {
        this.esCorrecta = false;
    }

    /**
     * Constructor con parámetros básicos
     */
    public Respuesta(String textoRespuesta, Boolean esCorrecta) {
        this.textoRespuesta = textoRespuesta;
        this.esCorrecta = esCorrecta;
    }

    /**
     * Constructor completo para tipos complejos
     */
    public Respuesta(String textoRespuesta, Boolean esCorrecta, String valor, Integer orden, String grupo) {
        this.textoRespuesta = textoRespuesta;
        this.esCorrecta = esCorrecta;
        this.valor = valor;
        this.orden = orden;
        this.grupo = grupo;
    }

    /**
     * Valida que la respuesta sea apropiada para el tipo de pregunta
     * @param tipoPregunta Tipo de pregunta de la que forma parte
     * @return true si la respuesta es válida para el tipo
     */
    public boolean esValidaParaTipo(TipoPregunta tipoPregunta) {
        switch (tipoPregunta) {
            case OPCION_MULTIPLE:
            case VERDADERO_FALSO:
                return textoRespuesta != null && !textoRespuesta.trim().isEmpty();
            case COMPLETAR_TEXTO:
            case RESPUESTA_CORTA:
                return (valor != null && !valor.trim().isEmpty()) ||
                        (textoRespuesta != null && !textoRespuesta.trim().isEmpty());
            case ORDENAR_ELEMENTOS:
                return textoRespuesta != null && orden != null;
            case ARRASTRAR_SOLTAR:
                return textoRespuesta != null && grupo != null;
            default:
                return false;
        }
    }
}