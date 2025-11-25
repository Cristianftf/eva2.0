package com.backendeva.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "inscripciones")
@Getter
@Setter
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "estudiante_id", nullable = false)
    private User estudiante;

    @ManyToOne
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;

    @Enumerated(EnumType.STRING)
    private EstadoInscripcion estado = EstadoInscripcion.PENDIENTE;

    private int progreso = 0;

    @Column(name = "fecha_inscripcion", nullable = false)
    private LocalDateTime fechaInscripcion = LocalDateTime.now();

    @Column(name = "fecha_aprobacion")
    private LocalDateTime fechaAprobacion;

    public enum EstadoInscripcion {
        PENDIENTE,
        APROBADA,
        RECHAZADA
    }
}