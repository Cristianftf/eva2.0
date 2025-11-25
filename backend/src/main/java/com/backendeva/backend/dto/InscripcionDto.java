package com.backendeva.backend.dto;

import java.time.LocalDateTime;

public class InscripcionDto {
    private Long id;
    private Long cursoId;
    private String cursoTitulo;
    private String cursoDescripcion;
    private Long estudianteId;
    private String estudianteNombre;
    private int progreso;
    private LocalDateTime fechaInscripcion;
    private boolean completado;
    private LocalDateTime fechaCompletado;
    private String estado;

    public InscripcionDto(Long id, Long cursoId, String cursoTitulo, String cursoDescripcion,
                         Long estudianteId, String estudianteNombre, int progreso,
                         LocalDateTime fechaInscripcion, boolean completado, LocalDateTime fechaCompletado,
                         String estado) {
        this.id = id;
        this.cursoId = cursoId;
        this.cursoTitulo = cursoTitulo;
        this.cursoDescripcion = cursoDescripcion;
        this.estudianteId = estudianteId;
        this.estudianteNombre = estudianteNombre;
        this.progreso = progreso;
        this.fechaInscripcion = fechaInscripcion;
        this.completado = completado;
        this.fechaCompletado = fechaCompletado;
        this.estado = estado;
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCursoId() { return cursoId; }
    public void setCursoId(Long cursoId) { this.cursoId = cursoId; }

    public String getCursoTitulo() { return cursoTitulo; }
    public void setCursoTitulo(String cursoTitulo) { this.cursoTitulo = cursoTitulo; }

    public String getCursoDescripcion() { return cursoDescripcion; }
    public void setCursoDescripcion(String cursoDescripcion) { this.cursoDescripcion = cursoDescripcion; }

    public Long getEstudianteId() { return estudianteId; }
    public void setEstudianteId(Long estudianteId) { this.estudianteId = estudianteId; }

    public String getEstudianteNombre() { return estudianteNombre; }
    public void setEstudianteNombre(String estudianteNombre) { this.estudianteNombre = estudianteNombre; }

    public int getProgreso() { return progreso; }
    public void setProgreso(int progreso) { this.progreso = progreso; }

    public LocalDateTime getFechaInscripcion() { return fechaInscripcion; }
    public void setFechaInscripcion(LocalDateTime fechaInscripcion) { this.fechaInscripcion = fechaInscripcion; }

    public boolean isCompletado() { return completado; }
    public void setCompletado(boolean completado) { this.completado = completado; }

    public LocalDateTime getFechaCompletado() { return fechaCompletado; }
    public void setFechaCompletado(LocalDateTime fechaCompletado) { this.fechaCompletado = fechaCompletado; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}