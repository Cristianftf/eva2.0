package com.backendeva.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "resultados")
@Getter
@Setter
public class Resultado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cuestionario_id")
    private Cuestionario cuestionario;

    @ManyToOne
    @JoinColumn(name = "estudiante_id")
    private User estudiante;

    private Double calificacion;

    @Column(name = "fecha_completado")
    private java.time.LocalDateTime fechaCompletado = java.time.LocalDateTime.now();
}
