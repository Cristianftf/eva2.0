package com.backendeva.backend.model;

@Entity
public class Inscripcion {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne private Usuario estudiante;
    @ManyToOne private Curso curso;
    
    private int progreso = 0;
    private LocalDateTime fechaInscripcion = LocalDateTime.now();
}