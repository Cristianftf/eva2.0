package com.backendeva.backend.services;

import com.backendeva.backend.dto.InscripcionDto;
import com.backendeva.backend.model.Curso;
import com.backendeva.backend.model.Inscripcion;
import com.backendeva.backend.repository.InscripcionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InscripcionService {

    @Autowired
    private InscripcionRepository inscripcionRepository;

    @Autowired
    private CursoService cursoService; // Para obtener el objeto Curso

    public List<Inscripcion> findByCursoId(Long cursoId) {
        Curso curso = cursoService.findById(cursoId).orElse(null);
        if (curso == null) {
            return List.of(); // O lanzar una excepción
        }
        return inscripcionRepository.findByCurso(curso);
    }

    public Inscripcion save(Inscripcion inscripcion) {
        return inscripcionRepository.save(inscripcion);
    }

    public List<Inscripcion> findByEstudianteId(Long estudianteId) {
        return inscripcionRepository.findByEstudianteId(estudianteId);
    }

    public List<InscripcionDto> findByEstudianteIdAsDto(Long estudianteId) {
        List<Inscripcion> inscripciones = inscripcionRepository.findByEstudianteId(estudianteId);
        return inscripciones.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private InscripcionDto convertToDto(Inscripcion inscripcion) {
        return new InscripcionDto(
                inscripcion.getId(),
                inscripcion.getCurso().getId(),
                inscripcion.getCurso().getTitulo(),
                inscripcion.getCurso().getDescripcion(),
                inscripcion.getEstudiante().getId(),
                inscripcion.getEstudiante().getNombre() + " " + inscripcion.getEstudiante().getApellido(),
                inscripcion.getProgreso(),
                inscripcion.getFechaInscripcion(),
                inscripcion.getProgreso() >= 100, // completado si progreso >= 100
                null // fechaCompletado no implementada aún
        );
    }

    public Inscripcion actualizarProgreso(Long id, int progreso) {
        Optional<Inscripcion> optional = inscripcionRepository.findById(id);
        if (optional.isPresent()) {
            Inscripcion inscripcion = optional.get();
            inscripcion.setProgreso(progreso);
            return inscripcionRepository.save(inscripcion);
        }
        throw new RuntimeException("Inscripción no encontrada");
    }
}
