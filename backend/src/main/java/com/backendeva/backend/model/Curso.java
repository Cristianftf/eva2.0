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
    private boolean activo;
    private LocalDate fechaCreacion;

    @ManyToOne
    @JoinColumn(name = "profesor_id")
    private User profesor;
}
