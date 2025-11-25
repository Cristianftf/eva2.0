package com.backendeva.backend.services;

import com.backendeva.backend.dto.InformeCursoDto;
import com.backendeva.backend.model.Curso;
import com.backendeva.backend.repository.CursoRepository;
import com.backendeva.backend.repository.InscripcionRepository;
import com.backendeva.backend.repository.ResultadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InformesService {

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private InscripcionRepository inscripcionRepository;

    @Autowired
    private ResultadoRepository resultadoRepository;

    public InformeCursoDto getInformeCurso(Long cursoId) {
        Curso curso = cursoRepository.findById(cursoId).orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        long totalEstudiantes = inscripcionRepository.countByCursoId(cursoId);
        Double promedioProgreso = inscripcionRepository.avgProgresoByCursoId(cursoId);
        Double promedioCalificaciones = resultadoRepository.avgCalificacionByCursoId(cursoId);

        InformeCursoDto informe = new InformeCursoDto();
        informe.setId(cursoId);
        informe.setCursoId(cursoId);
        informe.setCursoTitulo(curso.getTitulo());
        informe.setTotalEstudiantes((int) totalEstudiantes);
        informe.setPromedioProgreso(promedioProgreso != null ? promedioProgreso : 0.0);
        informe.setPromedioCalificaciones(promedioCalificaciones != null ? promedioCalificaciones : 0.0);
        informe.setFechaGeneracion(LocalDateTime.now());

        return informe;
    }

    public List<InformeCursoDto> getInformesProfesor(Long profesorId) {
        List<Curso> cursos = cursoRepository.findByProfesorId(profesorId);
        return cursos.stream().map(curso -> getInformeCurso(curso.getId())).collect(Collectors.toList());
    }

    public Map<String, Object> getInformeEstudiante(Long estudianteId, Long cursoId) {
        // Placeholder: lógica para informe de estudiante en un curso
        return Map.of("estudianteId", estudianteId, "cursoId", cursoId, "progreso", 0, "calificacion", 0.0);
    }
}