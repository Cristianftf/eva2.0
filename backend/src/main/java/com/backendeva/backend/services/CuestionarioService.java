package com.backendeva.backend.services;

import com.backendeva.backend.dto.EnviarCuestionarioDto;
import com.backendeva.backend.dto.RespuestaEstudianteDto;
import com.fasterxml.jackson.databind.JsonNode;
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

        // Procesar respuestas usando el nuevo formato
        int respuestasCorrectas = 0;
        List<RespuestaEstudianteDto> respuestasData = respuestas.getRespuestas();

        if (respuestasData != null) {
            for (RespuestaEstudianteDto respuestaData : respuestasData) {
                Integer preguntaId = respuestaData.getPreguntaId();

                if (preguntaId != null) {
                    // Buscar la pregunta por ID real, no por índice
                    Pregunta pregunta = preguntas.stream()
                        .filter(p -> p.getId().intValue() == preguntaId)
                        .findFirst()
                        .orElse(null);

                    if (pregunta != null) {
                        // Evaluar la respuesta según el tipo de pregunta
                        boolean esCorrecta = evaluarRespuesta(pregunta, respuestaData.getRespuesta());
                        if (esCorrecta) {
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
            preguntaMap.put("tipo", pregunta.getTipoPregunta().getCodigo());
            preguntaMap.put("tipoDescripcion", pregunta.getTipoPregunta().getDescripcion());

            // Configuración específica del tipo
            if (pregunta.getConfiguracionAdicional() != null) {
                preguntaMap.put("configuracionAdicional", pregunta.getConfiguracionAdicional());
            }

            // Procesar respuestas según el tipo
            if (pregunta.getRespuestas() != null) {
                switch (pregunta.getTipoPregunta()) {
                    case OPCION_MULTIPLE:
                    case VERDADERO_FALSO:
                        // Respuestas simples con texto y ID
                        preguntaMap.put("opciones", pregunta.getRespuestas().stream()
                            .map(respuesta -> {
                                Map<String, Object> respuestaMap = new HashMap<>();
                                respuestaMap.put("id", respuesta.getId());
                                respuestaMap.put("texto", respuesta.getTextoRespuesta());
                                respuestaMap.put("esCorrecta", respuesta.getEsCorrecta());
                                return respuestaMap;
                            })
                            .toList());
                        break;
                        
                    case COMPLETAR_TEXTO:
                        // Respuestas de texto libre
                        preguntaMap.put("respuestasReferencia", pregunta.getRespuestas().stream()
                            .map(respuesta -> {
                                Map<String, Object> respuestaMap = new HashMap<>();
                                respuestaMap.put("id", respuesta.getId());
                                respuestaMap.put("valor", respuesta.getValor());
                                respuestaMap.put("texto", respuesta.getTextoRespuesta());
                                return respuestaMap;
                            })
                            .toList());
                        break;
                        
                    case ORDENAR_ELEMENTOS:
                        // Elementos para ordenar
                        preguntaMap.put("elementosOrdenar", pregunta.getRespuestas().stream()
                            .map(respuesta -> {
                                Map<String, Object> respuestaMap = new HashMap<>();
                                respuestaMap.put("id", respuesta.getId());
                                respuestaMap.put("texto", respuesta.getTextoRespuesta());
                                respuestaMap.put("ordenCorrecto", respuesta.getOrden());
                                return respuestaMap;
                            })
                            .toList());
                        break;
                        
                    case ARRASTRAR_SOLTAR:
                        // Elementos para arrastrar y soltar
                        preguntaMap.put("elementosArrastrar", pregunta.getRespuestas().stream()
                            .filter(r -> "origen".equals(r.getGrupo()))
                            .map(respuesta -> {
                                Map<String, Object> respuestaMap = new HashMap<>();
                                respuestaMap.put("id", respuesta.getId());
                                respuestaMap.put("texto", respuesta.getTextoRespuesta());
                                return respuestaMap;
                            })
                            .toList());
                        preguntaMap.put("destinos", pregunta.getRespuestas().stream()
                            .filter(r -> "destino".equals(r.getGrupo()))
                            .map(respuesta -> {
                                Map<String, Object> respuestaMap = new HashMap<>();
                                respuestaMap.put("id", respuesta.getId());
                                respuestaMap.put("texto", respuesta.getTextoRespuesta());
                                
                                // Buscar elemento correcto asociado
                                Long elementoCorrecto = pregunta.getRespuestas().stream()
                                    .filter(r -> "origen".equals(r.getGrupo()) && respuesta.getEsCorrecta())
                                    .findFirst()
                                    .map(Respuesta::getId)
                                    .orElse(null);
                                respuestaMap.put("elementoCorrecto", elementoCorrecto);
                                
                                return respuestaMap;
                            })
                            .toList());
                        break;
                }
            } else {
                preguntaMap.put("opciones", List.of());
            }

            return preguntaMap;
        }).toList();
    }

    public void delete(Long id) {
        cuestionarioRepository.deleteById(id);
    }

    /**
     * Valida que una pregunta tenga la configuración correcta según su tipo
     * @param pregunta Pregunta a validar
     * @return true si la pregunta es válida
     */
    public boolean validarPregunta(Pregunta pregunta) {
        if (pregunta.getTextoPregunta() == null || pregunta.getTextoPregunta().trim().isEmpty()) {
            return false;
        }

        if (pregunta.getTipoPregunta() == null) {
            return false;
        }

        switch (pregunta.getTipoPregunta()) {
            case OPCION_MULTIPLE:
            case VERDADERO_FALSO:
                return pregunta.getRespuestas() != null &&
                       pregunta.getRespuestas().size() >= 2 &&
                       pregunta.getRespuestas().stream().anyMatch(Respuesta::getEsCorrecta);
                       
            case COMPLETAR_TEXTO:
                // Las preguntas de completar texto pueden no tener respuestas definidas
                return true;
                
            case ARRASTRAR_SOLTAR:
            case ORDENAR_ELEMENTOS:
                return pregunta.getConfiguracionAdicional() != null &&
                       !pregunta.getConfiguracionAdicional().trim().isEmpty();
                       
            default:
                return false;
        }
    }

    /**
     * Valida que una respuesta sea apropiada para el tipo de pregunta
     * @param respuesta Respuesta a validar
     * @param tipoPregunta Tipo de pregunta correspondiente
     * @return true si la respuesta es válida
     */
    public boolean validarRespuesta(Respuesta respuesta, TipoPregunta tipoPregunta) {
        return respuesta != null && respuesta.esValidaParaTipo(tipoPregunta);
    }

    /**
     * Evalúa si una respuesta del estudiante es correcta según el tipo de pregunta
     * @param pregunta Pregunta correspondiente
     * @param respuestaEstudiante Respuesta enviada por el estudiante
     * @return true si la respuesta es correcta
     */
    public boolean evaluarRespuesta(Pregunta pregunta, Object respuestaEstudiante) {
        if (pregunta.getTipoPregunta() == null) {
            return false;
        }

        switch (pregunta.getTipoPregunta()) {
            case OPCION_MULTIPLE:
            case VERDADERO_FALSO:
                if (respuestaEstudiante instanceof Integer) {
                    Long respuestaId = ((Integer) respuestaEstudiante).longValue();
                    return pregunta.getRespuestas().stream()
                        .anyMatch(r -> r.getId().equals(respuestaId) && r.getEsCorrecta());
                }
                return false;
                
            case COMPLETAR_TEXTO:
                if (respuestaEstudiante instanceof String) {
                    String textoIngresado = ((String) respuestaEstudiante).toLowerCase().trim();
                    return pregunta.getRespuestas().stream()
                        .anyMatch(r -> {
                            String valorCorrecto = r.getValor() != null ? r.getValor() : r.getTextoRespuesta();
                            return valorCorrecto != null &&
                                   valorCorrecto.toLowerCase().trim().equals(textoIngresado);
                        });
                }
                return false;
                
            case ORDENAR_ELEMENTOS:
                if (respuestaEstudiante instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<Integer> ordenIngresado = (List<Integer>) respuestaEstudiante;
                    List<Long> ordenCorrecto = pregunta.getRespuestas().stream()
                        .sorted((a, b) -> a.getOrden().compareTo(b.getOrden()))
                        .map(Respuesta::getId)
                        .toList();
                    return ordenIngresado.equals(ordenCorrecto.stream().map(Long::intValue).toList());
                }
                return false;
                
            case ARRASTRAR_SOLTAR:
                if (respuestaEstudiante instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> asociaciones = (Map<String, Object>) respuestaEstudiante;
                    
                    // Verificar todas las asociaciones correctas
                    for (Respuesta destino : pregunta.getRespuestas()) {
                        if ("destino".equals(destino.getGrupo())) {
                            Object elementoCorrecto = asociaciones.get("elemento_" + destino.getId());
                            Long elementoId = elementoCorrecto != null ? Long.valueOf(elementoCorrecto.toString()) : null;
                            
                            // Buscar si la asociación es correcta
                            boolean esCorrecta = pregunta.getRespuestas().stream()
                                .filter(r -> "origen".equals(r.getGrupo()))
                                .anyMatch(r -> r.getId().equals(elementoId) && destino.getEsCorrecta());
                                
                            if (!esCorrecta) {
                                return false;
                            }
                        }
                    }
                    return true;
                }
                return false;
                
            default:
                return false;
        }
    }
}
