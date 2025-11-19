package com.backendeva.backend.dto;

public class EstadisticasDto {
    private int totalUsuarios;
    private int totalCursos;
    private int totalRecursos;
    private int actividadMensual;

    public EstadisticasDto(int totalUsuarios, int totalCursos, int totalRecursos, int actividadMensual) {
        this.totalUsuarios = totalUsuarios;
        this.totalCursos = totalCursos;
        this.totalRecursos = totalRecursos;
        this.actividadMensual = actividadMensual;
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
}
