package com.backendeva.backend.services;

import com.backendeva.backend.dto.EnviarCuestionarioDto;
import com.backendeva.backend.model.Cuestionario;
import com.backendeva.backend.model.Curso;
import com.backendeva.backend.model.Resultado;
import com.backendeva.backend.model.User;
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

        // Lógica para procesar respuestas y calcular calificación
        // Placeholder: calcular calificación basada en respuestas correctas
        double calificacion = Math.random() * 100; // Lógica real aquí - por ahora random
        boolean aprobado = calificacion >= 70;

        // Guardar resultado en BD
        Optional<Cuestionario> cuestionarioOpt = cuestionarioRepository.findById(id);
        if (cuestionarioOpt.isPresent()) {
            Cuestionario cuestionario = cuestionarioOpt.get();

            Resultado resultado = new Resultado();
            resultado.setCuestionario(cuestionario);
            resultado.setEstudiante(estudiante);
            resultado.setCalificacion(calificacion);
            resultadoRepository.save(resultado);
        }

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

    public void delete(Long id) {
        cuestionarioRepository.deleteById(id);
    }
}