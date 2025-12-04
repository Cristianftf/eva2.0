package com.backendeva.backend.services;

import com.backendeva.backend.dto.EnviarCuestionarioDto;
import com.backendeva.backend.dto.RespuestaDto;
import com.backendeva.backend.model.*;
import com.backendeva.backend.repository.CuestionarioRepository;
import com.backendeva.backend.repository.ResultadoRepository;
import com.backendeva.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@SuppressWarnings("null")
public class CuestionarioService {

    @Autowired
    private CuestionarioRepository cuestionarioRepository;

    @Autowired
    private ResultadoRepository resultadoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CursoService cursoService; // Para obtener el objeto Curso

    public List<Cuestionario> findAll() {
        return cuestionarioRepository.findAll();
    }

    public Optional<Cuestionario> findById(Long id) {
        return cuestionarioRepository.findById(id);
    }

    public List<Cuestionario> findByCursoId(Long cursoId) {
        Curso curso = cursoService.findById(cursoId).orElse(null);
        if (curso == null) {
            return List.of(); // O lanzar una excepción
        }
        return cuestionarioRepository.findByCurso(curso);
    }

    public Cuestionario create(Cuestionario cuestionario) {
        // Lógica adicional si es necesario
        return cuestionarioRepository.save(cuestionario);
    }

    public Map<String, Object> responderCuestionario(Long id, EnviarCuestionarioDto respuestas) {
        // Obtener estudiante del contexto de seguridad
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User estudiante = userRepository.findFirstByEmailOrderByIdAsc(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Optional<Cuestionario> cuestionarioOpt = cuestionarioRepository.findById(id);
        if (cuestionarioOpt.isEmpty()) {
            throw new RuntimeException("Cuestionario no encontrado");
        }

        Cuestionario cuestionario = cuestionarioOpt.get();
        List<Pregunta> preguntas = cuestionario.getPreguntas();

        if (preguntas == null || preguntas.isEmpty()) {
            // Si no hay preguntas, devolver calificación perfecta
            Map<String, Object> response = new HashMap<>();
            response.put("calificacion", 100);
            response.put("aprobado", true);
            return response;
        }

        // Procesar respuestas
        int respuestasCorrectas = 0;
        List<RespuestaDto> respuestasData = respuestas.getRespuestas();

        if (respuestasData != null) {
            for (RespuestaDto respuestaData : respuestasData) {
                Integer preguntaId = respuestaData.getPreguntaId();
                Integer respuestaId = respuestaData.getRespuestaId();

                if (preguntaId != null && respuestaId != null && preguntaId < preguntas.size()) {
                    Pregunta pregunta = preguntas.get(preguntaId);
                    List<Respuesta> opciones = pregunta.getRespuestas();

                    if (opciones != null && respuestaId < opciones.size()) {
                        Respuesta respuestaSeleccionada = opciones.get(respuestaId);
                        if (respuestaSeleccionada.getEsCorrecta()) {
                            respuestasCorrectas++;
                        }
                    }
                }
            }
        }

        // Calcular calificación
        double calificacion = preguntas.isEmpty() ? 100 : (double) respuestasCorrectas / preguntas.size() * 100;
        boolean aprobado = calificacion >= 70;

        // Guardar resultado en BD
        Resultado resultado = new Resultado();
        resultado.setCuestionario(cuestionario);
        resultado.setEstudiante(estudiante);
        resultado.setCalificacion(calificacion);
        resultadoRepository.save(resultado);

        Map<String, Object> response = new HashMap<>();
        response.put("calificacion", Math.round(calificacion));
        response.put("aprobado", aprobado);
        return response;
    }

    public List<Map<String, Object>> getResultados(Long id) {
        // Lógica para obtener resultados de estudiantes
        // Placeholder
        return List.of(new HashMap<>()); // Lista vacía por ahora
    }

    public List<Map<String, Object>> getResultadosByEstudiante(Long estudianteId) {
        List<Resultado> resultados = resultadoRepository.findByEstudianteId(estudianteId);
        return resultados.stream().map(resultado -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", resultado.getId());
            map.put("cuestionario", resultado.getCuestionario().getTitulo());
            map.put("curso", resultado.getCuestionario().getCurso().getTitulo());
            map.put("calificacion", resultado.getCalificacion());
            map.put("fecha", resultado.getFechaCompletado());
            map.put("estado", resultado.getCalificacion() >= 70 ? "aprobado" : "reprobado");
            return map;
        }).toList();
    }

    public List<Map<String, Object>> getPreguntasByCuestionarioId(Long cuestionarioId) {
        Optional<Cuestionario> cuestionarioOpt = cuestionarioRepository.findById(cuestionarioId);
        if (cuestionarioOpt.isEmpty()) {
            return List.of();
        }

        Cuestionario cuestionario = cuestionarioOpt.get();
        if (cuestionario.getPreguntas() == null) {
            return List.of();
        }

        return cuestionario.getPreguntas().stream().map(pregunta -> {
            Map<String, Object> preguntaMap = new HashMap<>();
            preguntaMap.put("id", pregunta.getId());
            preguntaMap.put("texto", pregunta.getTextoPregunta());

            // Obtener opciones de respuesta
            if (pregunta.getRespuestas() != null) {
                List<String> opciones = pregunta.getRespuestas().stream()
                    .map(respuesta -> respuesta.getTextoRespuesta())
                    .toList();
                preguntaMap.put("opciones", opciones);
            } else {
                preguntaMap.put("opciones", List.of());
            }

            return preguntaMap;
        }).toList();
    }

    public void delete(Long id) {
        cuestionarioRepository.deleteById(id);
    }
}