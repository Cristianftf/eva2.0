package com.backendeva.backend.services;

import com.backendeva.backend.dto.ActividadRecienteDto;
import com.backendeva.backend.dto.EstadisticasDto;
import com.backendeva.backend.repository.CursoRepository;
import com.backendeva.backend.repository.RecursoRepository;
import com.backendeva.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class EstadisticasService {

    @Autowired
    private UserRepository usuarioRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private RecursoRepository recursoRepository;

    public EstadisticasDto getEstadisticasGenerales() {
        long totalUsuarios = usuarioRepository.count();
        long totalCursos = cursoRepository.count();
        long totalRecursos = recursoRepository.count();
        // Aquí se podría calcular la actividad mensual, pero por ahora se deja como 0
        int actividadMensual = 15; // Valor de ejemplo

        return new EstadisticasDto((int) totalUsuarios, (int) totalCursos, (int) totalRecursos, actividadMensual, 0, 0, 0);
    }

    public List<ActividadRecienteDto> getActividadReciente() {
        // Lógica de ejemplo para simular actividad reciente
        List<ActividadRecienteDto> actividad = new ArrayList<>();
        actividad.add(new ActividadRecienteDto(1L, "usuario", "Nuevo usuario registrado: Juan Pérez", LocalDateTime.now().minusDays(1)));
        actividad.add(new ActividadRecienteDto(2L, "curso", "Nuevo curso creado: Introducción a Java", LocalDateTime.now().minusDays(2)));
        actividad.add(new ActividadRecienteDto(3L, "cuestionario", "Cuestionario completado en 'Java Básico'", LocalDateTime.now().minusHours(5)));
        return actividad;
    }

    public EstadisticasDto getEstadisticasProfesor(Long profesorId) {
        long misCursos = cursoRepository.countByProfesorId(profesorId);
        long totalEstudiantes = cursoRepository.countEstudiantesByProfesorId(profesorId);
        long cuestionariosCreados = cursoRepository.countCuestionariosByProfesorId(profesorId);
        Double promedioCalificaciones = cursoRepository.avgCalificacionesByProfesorId(profesorId);

        return new EstadisticasDto(0, (int) misCursos, 0, 0, (int) totalEstudiantes, (int) cuestionariosCreados, promedioCalificaciones != null ? promedioCalificaciones : 0.0);
    }

    public EstadisticasDto getEstadisticasEstudiante(Long estudianteId) {
        long cursosInscritos = inscripcionRepository.countByEstudianteId(estudianteId);
        long cursosCompletados = inscripcionRepository.countByEstudianteIdAndProgreso(estudianteId, 100);
        Double progresoPromedio = inscripcionRepository.avgProgresoByEstudianteId(estudianteId);
        // El cálculo de horas de estudio puede ser más complejo, por ahora un valor de ejemplo
        int horasEstudio = (int) (cursosInscritos * 10); // Estimación simple

        return new EstadisticasDto((int) cursosInscritos, (int) cursosCompletados, (int) (progresoPromedio != null ? progresoPromedio : 0.0), horasEstudio, 0, 0, 0);
    }
}
