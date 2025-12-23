package com.backendeva.backend.services;

import com.backendeva.backend.model.EvaluacionCRAAP;
import com.backendeva.backend.model.User;
import com.backendeva.backend.repository.EvaluacionCRAAPRepository;
import com.backendeva.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Servicio para manejo de evaluaciones CRAAP (Currency, Relevance, Authority, Accuracy, Purpose)
 */
@Service
@Transactional 
public class EvaluacionCRAAPService {
    
    @Autowired
    private EvaluacionCRAAPRepository evaluacionCRAAPRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Crear nueva evaluación CRAAP
     */
    public EvaluacionCRAAP crearEvaluacion(EvaluacionCRAAP evaluacion, Long usuarioId) {
        // Validar que el usuario existe
        if (usuarioId != null) {
            User usuario = userRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            evaluacion.setEvaluador(usuario);
        }
        
        // Calcular puntuación y conclusión
        evaluacion.calcularPuntuacionTotal();
        evaluacion.generarConclusion();
        evaluacion.setRecomendaciones(generarRecomendaciones(evaluacion));
        
        return evaluacionCRAAPRepository.save(evaluacion);
    }
    
    /**
     * Obtener evaluación por ID
     */
    @Transactional(readOnly = true)
    public Optional<EvaluacionCRAAP> getEvaluacionById(Long id) {
        @SuppressWarnings("null")
        Optional<EvaluacionCRAAP> result = evaluacionCRAAPRepository.findById(java.util.Objects.requireNonNull(id));
        return result;
    }
    
    /**
     * Obtener todas las evaluaciones de un usuario
     */
    @Transactional(readOnly = true)
    public List<EvaluacionCRAAP> getEvaluacionesByUsuario(Long usuarioId) {
        return evaluacionCRAAPRepository.findByEvaluadorIdOrderByFechaEvaluacionDesc(usuarioId);
    }
    
    /**
     * Actualizar evaluación CRAAP
     */
    public EvaluacionCRAAP actualizarEvaluacion(Long id, EvaluacionCRAAP evaluacionDetails) {
        @SuppressWarnings("null")
        EvaluacionCRAAP evaluacion = evaluacionCRAAPRepository.findById(java.util.Objects.requireNonNull(id))
            .orElseThrow(() -> new RuntimeException("Evaluación CRAAP no encontrada"));
        
        // Actualizar campos
        evaluacion.setTituloFuente(evaluacionDetails.getTituloFuente());
        evaluacion.setUrlFuente(evaluacionDetails.getUrlFuente());
        evaluacion.setDescripcionFuente(evaluacionDetails.getDescripcionFuente());
        evaluacion.setTipoFuente(evaluacionDetails.getTipoFuente());
        
        // Actualizar puntuaciones y comentarios
        evaluacion.setCurrencyPuntuacion(evaluacionDetails.getCurrencyPuntuacion());
        evaluacion.setCurrencyComentario(evaluacionDetails.getCurrencyComentario());
        evaluacion.setFechaPublicacion(evaluacionDetails.getFechaPublicacion());
        evaluacion.setFechaUltimaActualizacion(evaluacionDetails.getFechaUltimaActualizacion());
        
        evaluacion.setRelevancePuntuacion(evaluacionDetails.getRelevancePuntuacion());
        evaluacion.setRelevanceComentario(evaluacionDetails.getRelevanceComentario());
        evaluacion.setNivelRelevancia(evaluacionDetails.getNivelRelevancia());
        
        evaluacion.setAuthorityPuntuacion(evaluacionDetails.getAuthorityPuntuacion());
        evaluacion.setAuthorityComentario(evaluacionDetails.getAuthorityComentario());
        evaluacion.setAutorInstitucion(evaluacionDetails.getAutorInstitucion());
        evaluacion.setCredencialesAutor(evaluacionDetails.getCredencialesAutor());
        evaluacion.setEsAutorExperto(evaluacionDetails.getEsAutorExperto());
        
        evaluacion.setAccuracyPuntuacion(evaluacionDetails.getAccuracyPuntuacion());
        evaluacion.setAccuracyComentario(evaluacionDetails.getAccuracyComentario());
        evaluacion.setTieneReferencias(evaluacionDetails.getTieneReferencias());
        evaluacion.setNumeroReferencias(evaluacionDetails.getNumeroReferencias());
        evaluacion.setEsRevisionPar(evaluacionDetails.getEsRevisionPar());
        evaluacion.setHayErroresDetectados(evaluacionDetails.getHayErroresDetectados());
        
        evaluacion.setPurposePuntuacion(evaluacionDetails.getPurposePuntuacion());
        evaluacion.setPurposeComentario(evaluacionDetails.getPurposeComentario());
        evaluacion.setProposito(evaluacionDetails.getProposito());
        evaluacion.setTieneSesgo(evaluacionDetails.getTieneSesgo());
        evaluacion.setTipoSesgo(evaluacionDetails.getTipoSesgo());
        
        // Recalcular puntuación total y conclusión
        evaluacion.calcularPuntuacionTotal();
        evaluacion.generarConclusion();
        evaluacion.setRecomendaciones(generarRecomendaciones(evaluacion));
        
        return evaluacionCRAAPRepository.save(evaluacion);
    }
    
    /**
     * Eliminar evaluación
     */
    public void eliminarEvaluacion(Long id) {
        @SuppressWarnings("null")
        Long nonNullId = java.util.Objects.requireNonNull(id);
        evaluacionCRAAPRepository.deleteById(nonNullId);
    }
    
    /**
     * Obtener estadísticas de evaluaciones de un usuario
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getEstadisticasEvaluaciones(Long usuarioId) {
        List<EvaluacionCRAAP> evaluaciones = getEvaluacionesByUsuario(usuarioId);
        
        if (evaluaciones.isEmpty()) {
            return Map.of(
                "totalEvaluaciones", 0,
                "puntuacionPromedio", 0.0,
                "evaluacionesPorConclusion", Map.of(),
                "puntuacionPorCriterio", Map.of()
            );
        }
        
        // Calcular estadísticas
        double puntuacionPromedio = evaluaciones.stream()
            .mapToDouble(e -> e.getPuntuacionTotal() != null ? e.getPuntuacionTotal() : 0)
            .average()
            .orElse(0.0);
        
        // Contar por conclusión
        Map<String, Long> evaluacionesPorConclusion = evaluaciones.stream()
            .collect(java.util.stream.Collectors.groupingBy(
                EvaluacionCRAAP::getConclusion,
                java.util.stream.Collectors.counting()
            ));
        
        // Calcular puntuación promedio por criterio
        Map<String, Double> puntuacionPorCriterio = Map.of(
            "currency", evaluaciones.stream()
                .mapToInt(e -> e.getCurrencyPuntuacion() != null ? e.getCurrencyPuntuacion() : 0)
                .average()
                .orElse(0.0),
            "relevance", evaluaciones.stream()
                .mapToInt(e -> e.getRelevancePuntuacion() != null ? e.getRelevancePuntuacion() : 0)
                .average()
                .orElse(0.0),
            "authority", evaluaciones.stream()
                .mapToInt(e -> e.getAuthorityPuntuacion() != null ? e.getAuthorityPuntuacion() : 0)
                .average()
                .orElse(0.0),
            "accuracy", evaluaciones.stream()
                .mapToInt(e -> e.getAccuracyPuntuacion() != null ? e.getAccuracyPuntuacion() : 0)
                .average()
                .orElse(0.0),
            "purpose", evaluaciones.stream()
                .mapToInt(e -> e.getPurposePuntuacion() != null ? e.getPurposePuntuacion() : 0)
                .average()
                .orElse(0.0)
        );
        
        return Map.of(
            "totalEvaluaciones", evaluaciones.size(),
            "puntuacionPromedio", puntuacionPromedio,
            "evaluacionesPorConclusion", evaluacionesPorConclusion,
            "puntuacionPorCriterio", puntuacionPorCriterio
        );
    }
    
    /**
     * Obtener ejemplos de fuentes para evaluar
     */
    @Transactional(readOnly = true)
    public List<EvaluacionCRAAP> getEjemplosFuentes() {
        // Base de datos de ejemplos de fuentes para evaluar
        return List.of(
            crearEjemploWikipedia(),
            crearEjemploPubMed(),
            crearEjemploBlogPersonal(),
            crearEjemploNoticia(),
            crearEjemploArticuloAcademico()
        );
    }
    
    /**
     * Generar recomendaciones basadas en la evaluación
     */
    private String generarRecomendaciones(EvaluacionCRAAP evaluacion) {
        StringBuilder recomendaciones = new StringBuilder();
        
        // Recomendaciones por criterio
        if (evaluacion.getCurrencyPuntuacion() != null && evaluacion.getCurrencyPuntuacion() < 3) {
            recomendaciones.append("💡 <strong>Currency:</strong> Busca fuentes más actuales o verifica la fecha de publicación. ");
        }
        
        if (evaluacion.getRelevancePuntuacion() != null && evaluacion.getRelevancePuntuacion() < 3) {
            recomendaciones.append("💡 <strong>Relevance:</strong> Esta fuente puede no ser relevante para tu tema específico. Considera buscar fuentes más específicas. ");
        }
        
        if (evaluacion.getAuthorityPuntuacion() != null && evaluacion.getAuthorityPuntuacion() < 3) {
            recomendaciones.append("💡 <strong>Authority:</strong> Verifica las credenciales del autor y la reputación de la fuente. ");
        }
        
        if (evaluacion.getAccuracyPuntuacion() != null && evaluacion.getAccuracyPuntuacion() < 3) {
            recomendaciones.append("💡 <strong>Accuracy:</strong> Contrasta la información con otras fuentes confiables. ");
        }
        
        if (evaluacion.getPurposePuntuacion() != null && evaluacion.getPurposePuntuacion() < 3) {
            recomendaciones.append("💡 <strong>Purpose:</strong> Ten en cuenta el sesgo o propósito comercial de la fuente. ");
        }
        
        // Recomendación general basada en la conclusión
        switch (evaluacion.getConclusion()) {
            case "EXCELENTE":
                recomendaciones.append("<br><br>✅ <strong>Excelente fuente:</strong> Esta fuente es altamente confiable y apropiada para uso académico. ");
                break;
            case "BUENA":
                recomendaciones.append("<br><br>👍 <strong>Buena fuente:</strong> Esta fuente es confiable pero considera complementarla con otras. ");
                break;
            case "ACEPTABLE":
                recomendaciones.append("<br><br>⚠️ <strong>Fuente aceptable:</strong> Úsala con precaución y verifica información clave. ");
                break;
            case "POBRE":
                recomendaciones.append("<br><br>❌ <strong>Fuente pobre:</strong> No recomendada para uso académico serio. ");
                break;
            case "NO RECOMENDADA":
                recomendaciones.append("<br><br>🚫 <strong>No recomendada:</strong> Evita usar esta fuente para información académica. ");
                break;
        }
        
        return recomendaciones.toString();
    }
    
    // Métodos para crear ejemplos de fuentes
    
    private EvaluacionCRAAP crearEjemploWikipedia() {
        EvaluacionCRAAP ejemplo = new EvaluacionCRAAP();
        ejemplo.setTituloFuente("Inteligencia artificial - Wikipedia");
        ejemplo.setUrlFuente("https://es.wikipedia.org/wiki/Inteligencia_artificial");
        ejemplo.setDescripcionFuente("Artículo de Wikipedia sobre inteligencia artificial");
        ejemplo.setTipoFuente(EvaluacionCRAAP.TIPO_WEB);
        ejemplo.setCurrencyPuntuacion(4);
        ejemplo.setCurrencyComentario("El artículo se actualiza regularmente");
        ejemplo.setRelevancePuntuacion(4);
        ejemplo.setRelevanceComentario("Información general útil pero no específica");
        ejemplo.setAuthorityPuntuacion(2);
        ejemplo.setAuthorityComentario("Colaboradores anónimos, aunque hay referencias");
        ejemplo.setAccuracyPuntuacion(3);
        ejemplo.setAccuracyComentario("Generalmente preciso pero puede contener errores");
        ejemplo.setPurposePuntuacion(4);
        ejemplo.setProposito(EvaluacionCRAAP.PROPOSITO_INFORMAR);
        return ejemplo;
    }
    
    private EvaluacionCRAAP crearEjemploPubMed() {
        EvaluacionCRAAP ejemplo = new EvaluacionCRAAP();
        ejemplo.setTituloFuente("Machine Learning in Medical Diagnosis");
        ejemplo.setUrlFuente("https://pubmed.ncbi.nlm.nih.gov/");
        ejemplo.setDescripcionFuente("Artículo científico revisado por pares en PubMed");
        ejemplo.setTipoFuente(EvaluacionCRAAP.TIPO_ARTICULO);
        ejemplo.setCurrencyPuntuacion(5);
        ejemplo.setCurrencyComentario("Artículo publicado recientemente");
        ejemplo.setRelevancePuntuacion(5);
        ejemplo.setRelevanceComentario("Altamente relevante para el tema");
        ejemplo.setAuthorityPuntuacion(5);
        ejemplo.setAuthorityComentario("Autor con credenciales académicas verificadas");
        ejemplo.setAccuracyPuntuacion(5);
        ejemplo.setAccuracyComentario("Revisado por pares, múltiples referencias");
        ejemplo.setPurposePuntuacion(5);
        ejemplo.setProposito(EvaluacionCRAAP.PROPOSITO_ACADEMICO);
        return ejemplo;
    }
    
    private EvaluacionCRAAP crearEjemploBlogPersonal() {
        EvaluacionCRAAP ejemplo = new EvaluacionCRAAP();
        ejemplo.setTituloFuente("Mi opinión sobre la IA");
        ejemplo.setUrlFuente("https://miblogpersonal.com/ia");
        ejemplo.setDescripcionFuente("Blog personal con opiniones sobre inteligencia artificial");
        ejemplo.setTipoFuente(EvaluacionCRAAP.TIPO_WEB);
        ejemplo.setCurrencyPuntuacion(3);
        ejemplo.setCurrencyComentario("Artículo de hace 6 meses");
        ejemplo.setRelevancePuntuacion(2);
        ejemplo.setRelevanceComentario("Opiniones personales, no académicas");
        ejemplo.setAuthorityPuntuacion(1);
        ejemplo.setAuthorityComentario("Autor sin credenciales académicas");
        ejemplo.setAccuracyPuntuacion(2);
        ejemplo.setAccuracyComentario("Sin referencias, opiniones personales");
        ejemplo.setPurposePuntuacion(2);
        ejemplo.setProposito(EvaluacionCRAAP.PROPOSITO_PERSUADIR);
        ejemplo.setTieneSesgo(true);
        ejemplo.setTipoSesgo(EvaluacionCRAAP.SESGO_IDEOLOGICO);
        return ejemplo;
    }
    
    private EvaluacionCRAAP crearEjemploNoticia() {
        EvaluacionCRAAP ejemplo = new EvaluacionCRAAP();
        ejemplo.setTituloFuente("Avances en IA según periódico nacional");
        ejemplo.setUrlFuente("https://elperiodico.com/tecnologia/ia-avances");
        ejemplo.setDescripcionFuente("Artículo de periódico sobre avances en IA");
        ejemplo.setTipoFuente(EvaluacionCRAAP.TIPO_WEB);
        ejemplo.setCurrencyPuntuacion(4);
        ejemplo.setCurrencyComentario("Artículo reciente");
        ejemplo.setRelevancePuntuacion(3);
        ejemplo.setRelevanceComentario("Información general pero útil");
        ejemplo.setAuthorityPuntuacion(3);
        ejemplo.setAuthorityComentario("Periodista especializado, fuente conocida");
        ejemplo.setAccuracyPuntuacion(3);
        ejemplo.setAccuracyComentario("Informativo pero simplificado");
        ejemplo.setPurposePuntuacion(3);
        ejemplo.setProposito(EvaluacionCRAAP.PROPOSITO_INFORMAR);
        return ejemplo;
    }
    
    private EvaluacionCRAAP crearEjemploArticuloAcademico() {
        EvaluacionCRAAP ejemplo = new EvaluacionCRAAP();
        ejemplo.setTituloFuente("Deep Learning Applications in Healthcare");
        ejemplo.setUrlFuente("https://journal.example.com/deep-learning-healthcare");
        ejemplo.setDescripcionFuente("Artículo de revista académica revisada por pares");
        ejemplo.setTipoFuente(EvaluacionCRAAP.TIPO_ARTICULO);
        ejemplo.setCurrencyPuntuacion(5);
        ejemplo.setCurrencyComentario("Publicado este año");
        ejemplo.setRelevancePuntuacion(5);
        ejemplo.setRelevanceComentario("Altamente específico y relevante");
        ejemplo.setAuthorityPuntuacion(5);
        ejemplo.setAuthorityComentario("Autores con PhD y afiliación universitaria");
        ejemplo.setAccuracyPuntuacion(5);
        ejemplo.setAccuracyComentario("Metodología rigurosa, muchas referencias");
        ejemplo.setPurposePuntuacion(5);
        ejemplo.setProposito(EvaluacionCRAAP.PROPOSITO_ACADEMICO);
        return ejemplo;
    }
}