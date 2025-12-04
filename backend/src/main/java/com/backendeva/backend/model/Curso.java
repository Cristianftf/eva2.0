package com.backendeva.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    private String titulo;
    private String descripcion;
    private String objetivos;
    private Integer duracionEstimada; // en horas
    private String nivel; // principiante, intermedio, avanzado
    private String categoria;
    private boolean activo;
    private LocalDate fechaCreacion;

    @Column(columnDefinition = "TEXT")
    private String metadataLom; // JSON string con metadata LOM

    @ManyToOne
    @JoinColumn(name = "profesor_id")
    private User profesor;
}
