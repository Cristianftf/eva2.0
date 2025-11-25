package com.backendeva.backend.dto;

public class EstadisticasDto {
    private int totalUsuarios;
    private int totalCursos;
    private int totalRecursos;
    private int actividadMensual;
    private int nuevosUsuarios;
    private int cursosActivos;
    private int cuestionariosCompletados;
    private int horasEstudio; // Para estadísticas de estudiante

    public EstadisticasDto(int totalUsuarios, int totalCursos, int totalRecursos, int actividadMensual, int nuevosUsuarios, int cursosActivos, int cuestionariosCompletados) {
        this.totalUsuarios = totalUsuarios;
        this.totalCursos = totalCursos;
        this.totalRecursos = totalRecursos;
        this.actividadMensual = actividadMensual;
        this.nuevosUsuarios = nuevosUsuarios;
        this.cursosActivos = cursosActivos;
        this.cuestionariosCompletados = cuestionariosCompletados;
    }

    // Constructor para estadísticas de estudiante
    public EstadisticasDto(int cursosInscritos, int cursosCompletados, int progresoPromedio, int horasEstudio) {
        this.totalUsuarios = cursosInscritos;
        this.totalCursos = cursosCompletados;
        this.totalRecursos = progresoPromedio;
        this.horasEstudio = horasEstudio;
        this.actividadMensual = 0;
        this.nuevosUsuarios = 0;
        this.cursosActivos = 0;
        this.cuestionariosCompletados = 0;
    }

    public int getTotalUsuarios() {
        return totalUsuarios;
    }

    public void setTotalUsuarios(int totalUsuarios) {
        this.totalUsuarios = totalUsuarios;
    }

    public int getTotalCursos() {
        return totalCursos;
    }

    public void setTotalCursos(int totalCursos) {
        this.totalCursos = totalCursos;
    }

    public int getTotalRecursos() {
        return totalRecursos;
    }

    public void setTotalRecursos(int totalRecursos) {
        this.totalRecursos = totalRecursos;
    }

    public int getActividadMensual() {
        return actividadMensual;
    }

    public void setActividadMensual(int actividadMensual) {
        this.actividadMensual = actividadMensual;
    }

    public int getNuevosUsuarios() {
        return nuevosUsuarios;
    }

    public void setNuevosUsuarios(int nuevosUsuarios) {
        this.nuevosUsuarios = nuevosUsuarios;
    }

    public int getCursosActivos() {
        return cursosActivos;
    }

    public void setCursosActivos(int cursosActivos) {
        this.cursosActivos = cursosActivos;
    }

    public int getCuestionariosCompletados() {
        return cuestionariosCompletados;
    }

    public void setCuestionariosCompletados(int cuestionariosCompletados) {
        this.cuestionariosCompletados = cuestionariosCompletados;
    }

    public int getHorasEstudio() {
        return horasEstudio;
    }

    public void setHorasEstudio(int horasEstudio) {
        this.horasEstudio = horasEstudio;
    }
}
