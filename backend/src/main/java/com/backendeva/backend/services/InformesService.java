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
@SuppressWarnings("null")
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
        // Datos simulados para radar chart de competencias
        Map<String, Object> competencias = Map.of(
            "Acceso", 85,
            "Evaluacion", 72,
            "Uso", 90,
            "Comprension", 78,
            "Sintesis", 65,
            "Comunicacion", 88
        );

        // Preguntas falladas con retroalimentación
        List<Map<String, Object>> preguntasFalladas = List.of(
            Map.of(
                "pregunta", "¿Cuál es el operador booleano correcto para combinar términos?",
                "respuestaUsuario", "OR",
                "respuestaCorrecta", "AND",
                "retroalimentacion", "El operador AND combina términos para resultados más específicos",
                "enlaceLeccion", "/estudiante/curso/1"
            ),
            Map.of(
                "pregunta", "¿Qué significa el truncamiento en búsqueda?",
                "respuestaUsuario", "Eliminar resultados",
                "respuestaCorrecta", "Buscar variaciones de palabras",
                "retroalimentacion", "El truncamiento (*) busca todas las variaciones de una raíz",
                "enlaceLeccion", "/estudiante/curso/2"
            )
        );

        // Recomendaciones personalizadas
        List<String> recomendaciones = List.of(
            "Repasar operadores booleanos en el módulo de búsqueda básica",
            "Practicar con el simulador de búsqueda avanzada",
            "Completar el cuestionario de evaluación de fuentes"
        );

        return Map.of(
            "estudianteId", estudianteId,
            "cursoId", cursoId,
            "progreso", 75,
            "calificacion", 82.5,
            "competencias", competencias,
            "preguntasFalladas", preguntasFalladas,
            "recomendaciones", recomendaciones,
            "fechaGeneracion", LocalDateTime.now()
        );
    }
}