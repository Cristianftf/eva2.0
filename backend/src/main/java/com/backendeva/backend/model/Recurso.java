package com.backendeva.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "recursos")
@Getter
@Setter
public class Recurso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(length = 1000)
    private String descripcion;

    @Column(nullable = false)
    private String url;

    @Column(length = 50)
    private String categoria;

    @Column(length = 500)
    private String imagen;

    @Column(name = "fecha_agregado")
    private LocalDateTime fechaAgregado;

    @Column(columnDefinition = "TEXT")
    private String contenido;

    @Column(length = 100)
    private String especialidad;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Urgencia urgencia;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TipoRecurso tipo;

    @Column(length = 100)
    private String fuente;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(nullable = false)
    private boolean verificado = false;

    @Column(columnDefinition = "TEXT")
    private String tags; // JSON array como string

    public enum Urgencia {
        baja, media, alta
    }

    public enum TipoRecurso {
        prevencion, diagnostico, tratamiento, seguimiento
    }
}
