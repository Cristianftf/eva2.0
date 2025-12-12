package com.backendeva.backend.services;

import com.backendeva.backend.dto.InscripcionDto;
import com.backendeva.backend.model.Curso;
import com.backendeva.backend.model.Inscripcion;
import com.backendeva.backend.model.User;
import com.backendeva.backend.repository.InscripcionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InscripcionService {

    @Autowired
    private InscripcionRepository inscripcionRepository;

    @Autowired
    private CursoService cursoService; // Para obtener el objeto Curso

    @Autowired
    private UsuarioService usuarioService; // Para obtener usuarios

    @Autowired
    private NotificacionesService notificacionesService; // Para crear notificaciones

    public List<Inscripcion> findByCursoId(Long cursoId) {
        Curso curso = cursoService.findById(cursoId).orElse(null);
        if (curso == null) {
            return List.of(); // O lanzar una excepción
        }
        return inscripcionRepository.findByCurso(curso);
    }

    public Inscripcion save(Inscripcion inscripcion) {
        return inscripcionRepository.save(java.util.Objects.requireNonNull(inscripcion));
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
                null, // fechaCompletado no implementada aún
                inscripcion.getEstado().toString()
        );
    }

    public Inscripcion actualizarProgreso(Long id, int progreso) {
        @SuppressWarnings("null")
        Optional<Inscripcion> optional = inscripcionRepository.findById(java.util.Objects.requireNonNull(id));
        if (optional.isPresent()) {
            Inscripcion inscripcion = optional.get();
            inscripcion.setProgreso(progreso);
            return inscripcionRepository.save(inscripcion);
        }
        throw new RuntimeException("Inscripción no encontrada");
    }

    public int getProgresoByEstudianteAndCurso(Long estudianteId, Long cursoId) {
        Optional<Inscripcion> inscripcion = inscripcionRepository.findByEstudianteIdAndCursoId(estudianteId, cursoId);
        return inscripcion.map(Inscripcion::getProgreso).orElse(0);
    }

    // Sistema de solicitudes de inscripción
    public Inscripcion solicitarInscripcion(Long estudianteId, Long cursoId) {
        // Verificar si ya existe una solicitud
        Optional<Inscripcion> existente = inscripcionRepository.findByEstudianteIdAndCursoId(estudianteId, cursoId);
        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe una solicitud para este curso");
        }

        User estudiante = usuarioService.findById(estudianteId)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        Curso curso = cursoService.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        Inscripcion inscripcion = new Inscripcion();
        inscripcion.setEstudiante(estudiante);
        inscripcion.setCurso(curso);
        inscripcion.setEstado(Inscripcion.EstadoInscripcion.PENDIENTE);
        inscripcion.setProgreso(0);

        Inscripcion savedInscripcion = inscripcionRepository.save(inscripcion);

        // Crear notificación para el profesor
        notificacionesService.createNotificacion(
                curso.getProfesor().getId(),
                "Nueva solicitud de inscripción",
                "El estudiante " + estudiante.getNombre() + " " + estudiante.getApellido() +
                " ha solicitado inscribirse en el curso '" + curso.getTitulo() + "'",
                "SOLICITUD_INSCRIPCION"
        );

        return savedInscripcion;
    }

    public Inscripcion aprobarInscripcion(Long inscripcionId) {
        @SuppressWarnings("null")
        Inscripcion inscripcion = inscripcionRepository.findById(java.util.Objects.requireNonNull(inscripcionId))
                .orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));

        if (inscripcion.getEstado() != Inscripcion.EstadoInscripcion.PENDIENTE) {
            throw new RuntimeException("La inscripción ya fue procesada");
        }

        inscripcion.setEstado(Inscripcion.EstadoInscripcion.APROBADA);
        inscripcion.setFechaAprobacion(LocalDateTime.now());

        Inscripcion savedInscripcion = inscripcionRepository.save(inscripcion);

        // Crear notificación para el estudiante
        notificacionesService.createNotificacion(
                inscripcion.getEstudiante().getId(),
                "Inscripción aprobada",
                "Tu solicitud de inscripción al curso '" + inscripcion.getCurso().getTitulo() + "' ha sido aprobada",
                "INSCRIPCION_APROBADA"
        );

        return savedInscripcion;
    }

    public Inscripcion rechazarInscripcion(Long inscripcionId) {
        @SuppressWarnings("null")
        Inscripcion inscripcion = inscripcionRepository.findById(java.util.Objects.requireNonNull(inscripcionId))
                .orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));

        if (inscripcion.getEstado() != Inscripcion.EstadoInscripcion.PENDIENTE) {
            throw new RuntimeException("La inscripción ya fue procesada");
        }

        inscripcion.setEstado(Inscripcion.EstadoInscripcion.RECHAZADA);

        return inscripcionRepository.save(inscripcion);
    }

    public List<InscripcionDto> getSolicitudesPendientesPorProfesor(Long profesorId) {
        List<Curso> cursosProfesor = cursoService.getByProfesor(profesorId);
        List<Long> cursoIds = cursosProfesor.stream().map(Curso::getId).toList();

        List<Inscripcion> solicitudes = inscripcionRepository.findByCursoIdInAndEstado(cursoIds, Inscripcion.EstadoInscripcion.PENDIENTE);
        return solicitudes.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public boolean puedeAccederAlCurso(Long estudianteId, Long cursoId) {
        Optional<Inscripcion> inscripcion = inscripcionRepository.findByEstudianteIdAndCursoId(estudianteId, cursoId);
        return inscripcion.isPresent() && inscripcion.get().getEstado() == Inscripcion.EstadoInscripcion.APROBADA;
    }
}
