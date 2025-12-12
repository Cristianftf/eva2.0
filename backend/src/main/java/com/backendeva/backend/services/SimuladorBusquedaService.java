package com.backendeva.backend.services;

import com.backendeva.backend.model.*;
import com.backendeva.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Servicio para simular búsquedas académicas con operadores booleanos
 */
@Service
@Transactional
public class SimuladorBusquedaService {
    
    @Autowired
    private SimulacionBusquedaRepository simulacionBusquedaRepository;
    
    @Autowired
    private ResultadoSimulacionRepository resultadoSimulacionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Base de datos simulada de artículos académicos
    private static final Map<String, List<Map<String, Object>>> BASE_DATOS_ARTICULOS = Map.of(
        "MEDICINA", Arrays.asList(
            Map.of("titulo", "Efectividad de la terapia cognitiva en el tratamiento de la depresión", 
                   "descripcion", "Estudio randomizado controlado sobre la efectividad de la terapia cognitiva conductual en pacientes con trastorno depresivo mayor.",
                   "autores", "García, M., López, A., Rodríguez, P.",
                   "fecha", "2023", "fuente", "Revista de Psiquiatría Clínica",
                   "terminos", Arrays.asList("terapia", "cognitiva", "depresión", "tratamiento", "efectividad"),
                   "relevancia", 0.95),
            Map.of("titulo", "Impacto de los antidepresivos en la función cognitiva",
                   "descripcion", "Investigación sobre los efectos cognitivos a largo plazo de los inhibidores selectivos de la recaptación de serotonina.",
                   "autores", "Martínez, L., Sánchez, R.",
                   "fecha", "2022", "fuente", "Journal of Clinical Psychiatry",
                   "terminos", Arrays.asList("antidepresivos", "función", "cognitiva", "efectos"),
                   "relevancia", 0.80),
            Map.of("titulo", "Epidemiología de la diabetes tipo 2 en población española",
                   "descripcion", "Estudio transversal sobre la prevalencia y factores de riesgo de la diabetes mellitus tipo 2 en España.",
                   "autores", "Fernández, C., Torres, J.",
                   "fecha", "2023", "fuente", "Medicina Clínica",
                   "terminos", Arrays.asList("diabetes", "tipo", "epidemiología", "población"),
                   "relevancia", 0.60),
            Map.of("titulo", "Complicaciones cardiovasculares en pacientes diabéticos",
                   "descripcion", "Análisis de las complicaciones cardiovasculares asociadas a la diabetes mellitus y su manejo clínico.",
                   "autores", "Ruiz, A., Moreno, S.",
                   "fecha", "2023", "fuente", "Revista Española de Cardiología",
                   "terminos", Arrays.asList("diabetes", "complicaciones", "cardiovasculares", "pacientes"),
                   "relevancia", 0.90)
        ),
        "TECNOLOGIA", Arrays.asList(
            Map.of("titulo", "Inteligencia artificial en el diagnóstico médico",
                   "descripcion", "Aplicación de algoritmos de machine learning para el diagnóstico automático de enfermedades.",
                   "autores", "Johnson, K., Lee, S.",
                   "fecha", "2023", "fuente", "Nature Machine Intelligence",
                   "terminos", Arrays.asList("inteligencia", "artificial", "diagnóstico", "médico", "machine", "learning"),
                   "relevancia", 0.95),
            Map.of("titulo", "Blockchain y ciberseguridad en sistemas financieros",
                   "descripcion", "Análisis de la seguridad blockchain aplicada a transacciones financieras y sistemas de pago.",
                   "autores", "Wang, L., Chen, M.",
                   "fecha", "2023", "fuente", "IEEE Security & Privacy",
                   "terminos", Arrays.asList("blockchain", "ciberseguridad", "sistemas", "financieros"),
                   "relevancia", 0.85),
            Map.of("titulo", "Realidad virtual en educación: aplicaciones y beneficios",
                   "descripcion", "Estudio sobre el uso de tecnologías de realidad virtual para mejorar los procesos de enseñanza-aprendizaje.",
                   "autores", "Taylor, R., Brown, A.",
                   "fecha", "2022", "fuente", "Educational Technology Research",
                   "terminos", Arrays.asList("realidad", "virtual", "educación", "tecnología"),
                   "relevancia", 0.70)
        ),
        "PSICOLOGIA", Arrays.asList(
            Map.of("titulo", "Terapia familiar sistémica en adolescentes con trastornos alimentarios",
                   "descripcion", "Investigación sobre la efectividad de la terapia familiar sistémica en el tratamiento de trastornos alimentarios en adolescentes.",
                   "autores", "Hernández, M., Castro, P.",
                   "fecha", "2023", "fuente", "Journal of Family Therapy",
                   "terminos", Arrays.asList("terapia", "familiar", "sistémica", "adolescentes", "trastornos", "alimentarios"),
                   "relevancia", 0.90),
            Map.of("titulo", "Ansiedad y rendimiento académico en estudiantes universitarios",
                   "descripcion", "Estudio correlacional entre niveles de ansiedad y rendimiento académico en estudiantes de educación superior.",
                   "autores", "Jiménez, C., Vega, L.",
                   "fecha", "2023", "fuente", "Educational Psychology",
                   "terminos", Arrays.asList("ansiedad", "rendimiento", "académico", "estudiantes", "universitarios"),
                   "relevancia", 0.85)
        )
    );
    
    /**
     * Ejecutar una simulación de búsqueda
     */
    public SimulacionBusqueda ejecutarSimulacion(String consulta, String categoria, String nivel, Long usuarioId) {
        // Parsear la consulta
        ConsultaParsed parsed = parsearConsulta(consulta);
        
        // Generar resultados simulados
        List<ResultadoSimulacion> resultados = generarResultadosSimulados(consulta, parsed, categoria);
        
        // Evaluar la búsqueda
        EvaluacionBusqueda evaluacion = evaluarBusqueda(consulta, parsed, resultados);
        
        // Crear la simulación
        SimulacionBusqueda simulacion = new SimulacionBusqueda();
        simulacion.setTitulo("Búsqueda: " + consulta);
        simulacion.setConsultaUsuario(consulta);
        simulacion.setConsultaParsed(parsed.toString());
        simulacion.setRetroalimentacion(evaluacion.getRetroalimentacion());
        simulacion.setPuntuacion(evaluacion.getPuntuacion());
        simulacion.setNivelDificultad(nivel);
        simulacion.setCategoria(categoria);
        simulacion.setTotalResultados(resultados.size());
        simulacion.setResultadosRelevantes((int) resultados.stream().filter(r -> r.getRelevante()).count());
        simulacion.setOperadoresDetectados(String.join(", ", parsed.getOperadores()));
        
        // Guardar usuario si se proporciona
        if (usuarioId != null) {
            User usuario = userRepository.findById(usuarioId).orElse(null);
            if (usuario != null) {
                simulacion.setUsuario(usuario);
            }
        }
        
        // Guardar simulación y resultados
        simulacion = simulacionBusquedaRepository.save(simulacion);
        
        // Asociar resultados
        for (ResultadoSimulacion resultado : resultados) {
            resultado.setSimulacion(simulacion);
            resultadoSimulacionRepository.save(resultado);
        }
        
        simulacion.setResultados(resultados);
        return simulacion;
    }
    
    /**
     * Obtener simulaciones de un usuario
     */
    @Transactional(readOnly = true)
    public List<SimulacionBusqueda> getSimulacionesByUsuario(Long usuarioId) {
        return simulacionBusquedaRepository.findByUsuarioIdOrderByFechaSimulacionDesc(usuarioId);
    }
    
    /**
     * Obtener estadísticas de simulaciones
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getEstadisticasSimulaciones(Long usuarioId) {
        List<SimulacionBusqueda> simulaciones = getSimulacionesByUsuario(usuarioId);
        
        if (simulaciones.isEmpty()) {
            return Map.of(
                "totalSimulaciones", 0,
                "puntuacionPromedio", 0.0,
                "operadoresUsados", new HashMap<String, Integer>(),
                "categoriasPracticas", new HashMap<String, Integer>()
            );
        }
        
        // Calcular estadísticas
        double puntuacionPromedio = simulaciones.stream()
            .mapToDouble(s -> s.getPuntuacion() != null ? s.getPuntuacion() : 0)
            .average()
            .orElse(0.0);
        
        // Contar operadores usados
        Map<String, Long> operadoresContador = simulaciones.stream()
            .flatMap(s -> Arrays.stream(s.getOperadoresDetectados().split(", ")))
            .filter(op -> !op.isEmpty())
            .collect(Collectors.groupingBy(op -> op, Collectors.counting()));
        
        // Contar categorías practicadas
        Map<String, Long> categoriasContador = simulaciones.stream()
            .collect(Collectors.groupingBy(SimulacionBusqueda::getCategoria, Collectors.counting()));
        
        return Map.of(
            "totalSimulaciones", simulaciones.size(),
            "puntuacionPromedio", puntuacionPromedio,
            "operadoresUsados", operadoresContador,
            "categoriasPracticas", categoriasContador
        );
    }
    
    /**
     * Parsear consulta y detectar operadores
     */
    private ConsultaParsed parsearConsulta(String consulta) {
        ConsultaParsed parsed = new ConsultaParsed();
        
        // Detectar operadores (case insensitive)
        Pattern andPattern = Pattern.compile("\\bAND\\b", Pattern.CASE_INSENSITIVE);
        Pattern orPattern = Pattern.compile("\\bOR\\b", Pattern.CASE_INSENSITIVE);
        Pattern notPattern = Pattern.compile("\\bNOT\\b", Pattern.CASE_INSENSITIVE);
        Pattern minusPattern = Pattern.compile("-\\w+");
        
        if (andPattern.matcher(consulta).find()) {
            parsed.getOperadores().add("AND");
        }
        if (orPattern.matcher(consulta).find()) {
            parsed.getOperadores().add("OR");
        }
        if (notPattern.matcher(consulta).find() || minusPattern.matcher(consulta).find()) {
            parsed.getOperadores().add("NOT");
        }
        
        // Extraer términos (palabras que no son operadores)
        String sinOperadores = consulta
            .replaceAll("\\bAND\\b", " ")
            .replaceAll("\\bOR\\b", " ")
            .replaceAll("\\bNOT\\b", " ")
            .replaceAll("-\\w+", " ")
            .trim();
        
        String[] terminos = sinOperadores.split("\\s+");
        parsed.setTerminos(terminos);
        parsed.setOriginal(consulta);
        
        return parsed;
    }
    
    /**
     * Generar resultados simulados basados en la consulta
     */
    private List<ResultadoSimulacion> generarResultadosSimulados(String consulta, ConsultaParsed parsed, String categoria) {
        List<Map<String, Object>> articulosBase = BASE_DATOS_ARTICULOS.getOrDefault(categoria, new ArrayList<>());
        List<ResultadoSimulacion> resultados = new ArrayList<>();
        
        for (Map<String, Object> articulo : articulosBase) {
            ResultadoSimulacion resultado = new ResultadoSimulacion();
            resultado.setTitulo((String) articulo.get("titulo"));
            resultado.setDescripcion((String) articulo.get("descripcion"));
            resultado.setAutores((String) articulo.get("autores"));
            resultado.setFechaPublicacion((String) articulo.get("fecha"));
            resultado.setFuente((String) articulo.get("fuente"));
            
            @SuppressWarnings("unchecked")
            List<String> terminosArticulo = (List<String>) articulo.get("terminos");
            resultado.setTerminos(terminosArticulo);
            
            // Calcular relevancia basada en operadores
            double relevancia = calcularRelevancia(consulta, parsed, terminosArticulo);
            resultado.setRelevante(relevancia > 0.3);
            resultado.setPuntuacionRelevancia(relevancia);
            
            // Determinar términos encontrados
            StringBuilder terminosEncontrados = new StringBuilder();
            for (String termino : parsed.getTerminos()) {
                if (terminosArticulo.stream().anyMatch(t -> t.toLowerCase().contains(termino.toLowerCase()))) {
                    if (terminosEncontrados.length() > 0) terminosEncontrados.append(", ");
                    terminosEncontrados.append(termino);
                }
            }
            resultado.setTerminosEncontrados(terminosEncontrados.toString());
            
            resultados.add(resultado);
        }
        
        return resultados;
    }
    
    /**
     * Calcular relevancia de un artículo para una consulta
     */
    private double calcularRelevancia(String consulta, ConsultaParsed parsed, List<String> terminosArticulo) {
        double relevancia = 0.0;
        
        // Contar términos coincidentes
        int coincidencias = 0;
        for (String termino : parsed.getTerminos()) {
            if (terminosArticulo.stream().anyMatch(t -> t.toLowerCase().contains(termino.toLowerCase()))) {
                coincidencias++;
            }
        }
        
        if (parsed.getTerminos().length > 0) {
            relevancia = (double) coincidencias / parsed.getTerminos().length;
        }
        
        // Bonificación por usar operadores
        if (!parsed.getOperadores().isEmpty()) {
            relevancia *= 1.2; // 20% de bonificación
        }
        
        // Penalización por NOT si hay términos excluidos presentes
        if (parsed.getOperadores().contains("NOT")) {
            // Simular penalización por exclusiones
            relevancia *= 0.9;
        }
        
        return Math.min(relevancia, 1.0);
    }
    
    /**
     * Evaluar la calidad de la búsqueda
     */
    private EvaluacionBusqueda evaluarBusqueda(String consulta, ConsultaParsed parsed, List<ResultadoSimulacion> resultados) {
        EvaluacionBusqueda evaluacion = new EvaluacionBusqueda();
        StringBuilder retroalimentacion = new StringBuilder();
        double puntuacion = 0.0;
        
        // Evaluar uso de operadores
        if (parsed.getOperadores().isEmpty()) {
            retroalimentacion.append("⚠️ <strong>Consejo:</strong> Tu búsqueda podría mejorarse usando operadores booleanos (AND, OR, NOT) para obtener resultados más precisos.<br><br>");
            puntuacion += 0.3; // Puntuación base por hacer una búsqueda
        } else {
            retroalimentacion.append("✅ <strong>Bien hecho:</strong> Estás usando operadores booleanos para refinar tu búsqueda.<br><br>");
            puntuacion += 0.5;
            
            if (parsed.getOperadores().contains("AND")) {
                retroalimentacion.append("✅ El uso de <strong>AND</strong> ayuda a enfocar la búsqueda en términos específicos.<br>");
            }
            if (parsed.getOperadores().contains("OR")) {
                retroalimentacion.append("✅ El uso de <strong>OR</strong> amplía la búsqueda para incluir sinónimos.<br>");
            }
            if (parsed.getOperadores().contains("NOT")) {
                retroalimentacion.append("✅ El uso de <strong>NOT</strong> excluye términos no deseados.<br>");
            }
        }
        
        // Evaluar resultados
        long resultadosRelevantes = resultados.stream().filter(r -> r.getRelevante()).count();
        double precision = resultados.size() > 0 ? (double) resultadosRelevantes / resultados.size() : 0.0;
        
        retroalimentacion.append("<br><strong>Análisis de resultados:</strong><br>");
        retroalimentacion.append(String.format("• Total de resultados: %d<br>", resultados.size()));
        retroalimentacion.append(String.format("• Resultados relevantes: %d (%.1f%% de precisión)<br>", resultadosRelevantes, precision * 100));
        
        // Calcular puntuación final
        puntuacion += precision * 0.5;
        
        // Consejos específicos
        if (precision < 0.3) {
            retroalimentacion.append("<br>💡 <strong>Para mejorar:</strong> Considera usar más términos específicos o combinar diferentes operadores.");
        } else if (precision > 0.7) {
            retroalimentacion.append("<br>🎉 <strong>Excelente:</strong> Tu estrategia de búsqueda es muy efectiva.");
        }
        
        evaluacion.setRetroalimentacion(retroalimentacion.toString());
        evaluacion.setPuntuacion(Math.min(puntuacion, 1.0));
        
        return evaluacion;
    }
    
    // Clases internas para ayudar con el parsing y evaluación
    private static class ConsultaParsed {
        private List<String> operadores = new ArrayList<>();
        private String[] terminos;
        private String original;
        
        public List<String> getOperadores() { return operadores; }
        @SuppressWarnings("unused")
        public void setOperadores(List<String> operadores) { this.operadores = operadores; }
        public String[] getTerminos() { return terminos; }
        public void setTerminos(String[] terminos) { this.terminos = terminos; }
        @SuppressWarnings("unused")
        public String getOriginal() { return original; }
        public void setOriginal(String original) { this.original = original; }
        
        @Override
        public String toString() {
            return String.format("Términos: %s, Operadores: %s", 
                Arrays.toString(terminos), operadores);
        }
    }
    
    private static class EvaluacionBusqueda {
        private String retroalimentacion;
        private double puntuacion;
        
        public String getRetroalimentacion() { return retroalimentacion; }
        public void setRetroalimentacion(String retroalimentacion) { this.retroalimentacion = retroalimentacion; }
        public double getPuntuacion() { return puntuacion; }
        public void setPuntuacion(double puntuacion) { this.puntuacion = puntuacion; }
    }
}