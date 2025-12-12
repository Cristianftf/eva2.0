# Plan de Acción para Mejoras EVA 2.0

## Introducción

Este documento presenta un plan de acción detallado para implementar las mejoras identificadas en el análisis de cumplimiento del proyecto EVA 2.0. El plan sigue una metodología ágil con entregas incrementales y priorización basada en impacto vs. esfuerzo.

## Priorización de Mejoras

| Mejora | Impacto | Esfuerzo | Prioridad | Sprint |
|--------|---------|----------|-----------|--------|
| Implementar SCORM/IMS QTI completo | Alto | Medio | 1 | 1-2 |
| Mejorar accesibilidad WCAG 2.1 | Medio | Bajo | 2 | 1 |
| Implementar analítica avanzada | Alto | Alto | 3 | 2-3 |
| Implementar sistema de caching | Alto | Medio | 4 | 1 |
| Documentación técnica completa | Medio | Medio | 5 | 1-2 |
| Optimización de rendimiento | Alto | Alto | 6 | 3 |
| Implementar lecciones individuales | Medio | Medio | 7 | 2 |

## Sprint 1: Fundamentos y Mejoras Rápidas (2 semanas)

### Objetivo: Implementar mejoras de alto impacto con bajo/medio esfuerzo

#### Tarea 1.1: Implementar sistema de caching básico
**Responsable:** Backend Team
**Duración:** 3 días
**Entregables:**
- Configuración de Redis para caching
- Implementar caching en endpoints críticos
- Métricas de rendimiento mejorado

**Implementación:**
```java
// Ejemplo de implementación de caching en CuestionarioService
@Cacheable(value = "cuestionarios", key = "#id")
public Optional<Cuestionario> findById(Long id) {
    return cuestionarioRepository.findById(id);
}

@CacheEvict(value = "cuestionarios", key = "#cuestionario.id")
public Cuestionario save(Cuestionario cuestionario) {
    return cuestionarioRepository.save(cuestionario);
}
```

#### Tarea 1.2: Mejoras de accesibilidad básicas
**Responsable:** Frontend Team
**Duración:** 4 días
**Entregables:**
- Auditoría inicial WCAG 2.1
- Correcciones de contraste de color
- Implementación de ARIA labels
- Navegación por teclado mejorada

**Implementación:**
```tsx
// Ejemplo de mejoras de accesibilidad en componentes
<Button
  aria-label="Enviar cuestionario"
  onClick={enviarCuestionario}
  disabled={enviando}
>
  {enviando ? "Enviando..." : "Enviar Cuestionario"}
</Button>

<Input
  aria-describedby="email-help"
  placeholder="Correo electrónico"
/>
```

#### Tarea 1.3: Documentación técnica inicial
**Responsable:** Tech Lead
**Duración:** 5 días
**Entregables:**
- Documentación de API con Swagger/OpenAPI
- Guía de instalación y configuración
- Diagrama de arquitectura actualizado

## Sprint 2: Interoperabilidad y Contenido (2 semanas)

### Objetivo: Implementar estándares educativos y completar gestión de contenido

#### Tarea 2.1: Implementar SCORM completo
**Responsable:** Backend Team
**Duración:** 7 días
**Entregables:**
- Importación de paquetes SCORM
- Exportación de contenido en formato SCORM
- Validación de paquetes SCORM

**Implementación:**
```java
// Nuevo servicio SCORM
@Service
public class ScormService {

    @Autowired
    private CursoRepository cursoRepository;

    public String importScormPackage(MultipartFile file) throws IOException {
        // Lógica de importación SCORM
        ScormPackage scormPackage = ScormParser.parse(file.getInputStream());
        Curso curso = convertScormToCurso(scormPackage);
        cursoRepository.save(curso);
        return "Paquete SCORM importado exitosamente";
    }

    public byte[] exportScormPackage(Long cursoId) {
        Curso curso = cursoRepository.findById(cursoId).orElseThrow();
        ScormPackage scormPackage = convertCursoToScorm(curso);
        return ScormGenerator.generate(scormPackage);
    }
}
```

#### Tarea 2.2: Implementar IMS QTI completo
**Responsable:** Backend Team
**Duración:** 5 días
**Entregables:**
- Importación de cuestionarios QTI
- Exportación de cuestionarios en formato QTI
- Validación de XML QTI

**Implementación:**
```java
// Mejoras en CuestionarioService para QTI
public class CuestionarioService {

    public Cuestionario importQtiPackage(String qtiXml) {
        QtiPackage qtiPackage = QtiParser.parse(qtiXml);
        Cuestionario cuestionario = new Cuestionario();
        cuestionario.setTitulo(qtiPackage.getTitle());
        cuestionario.setQtiPayload(qtiXml);

        // Convertir preguntas QTI a nuestro modelo
        List<Pregunta> preguntas = qtiPackage.getItems().stream()
            .map(this::convertQtiItemToPregunta)
            .collect(Collectors.toList());

        cuestionario.setPreguntas(preguntas);
        return cuestionarioRepository.save(cuestionario);
    }

    public String exportQtiPackage(Long cuestionarioId) {
        Cuestionario cuestionario = cuestionarioRepository.findById(cuestionarioId)
            .orElseThrow(() -> new EntityNotFoundException("Cuestionario no encontrado"));

        QtiPackage qtiPackage = convertCuestionarioToQti(cuestionario);
        return QtiGenerator.generate(qtiPackage);
    }
}
```

#### Tarea 2.3: Implementar lecciones individuales
**Responsable:** Full Stack Team
**Duración:** 4 días
**Entregables:**
- Modelo de Leccion
- Endpoints para gestión de lecciones
- Integración con temas existentes

**Implementación:**
```java
// Nuevo modelo Leccion
@Entity
public class Leccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String contenido;
    private int orden;

    @Enumerated(EnumType.STRING)
    private TipoContenido tipoContenido; // TEXTO, VIDEO, INTERACTIVO, etc.

    @ManyToOne
    @JoinColumn(name = "tema_id")
    private Tema tema;

    // Getters y Setters
}
```

## Sprint 3: Analítica Avanzada y Optimización (3 semanas)

### Objetivo: Implementar funcionalidades avanzadas de analítica y optimización

#### Tarea 3.1: Implementar analítica educativa avanzada
**Responsable:** Backend + Data Team
**Duración:** 10 días
**Entregables:**
- Sistema de métricas de aprendizaje
- Generación de mapas de calor
- Análisis de patrones de aprendizaje
- Informes avanzados con visualizaciones

**Implementación:**
```java
// Nuevo servicio de analítica
@Service
public class AnaliticaService {

    @Autowired
    private ResultadoRepository resultadoRepository;

    public Map<String, Object> generarMapaCalor(Long cursoId) {
        List<Resultado> resultados = resultadoRepository.findByCuestionario_CursoId(cursoId);

        // Agrupar por pregunta y calcular estadísticas
        Map<Long, PreguntaStats> preguntaStats = resultados.stream()
            .flatMap(r -> r.getRespuestas().stream())
            .collect(Collectors.groupingBy(
                Respuesta::getPreguntaId,
                Collectors.collectingAndThen(
                    Collectors.toList(),
                    list -> {
                        long total = list.size();
                        long correctas = list.stream().filter(Respuesta::isCorrecta).count();
                        return new PreguntaStats(total, correctas, (double)correctas/total);
                    }
                )
            ));

        return Map.of(
            "preguntaStats", preguntaStats,
            "promedioCurso", calcularPromedioCurso(resultados),
            "distribucionCalificaciones", generarDistribucion(resultados)
        );
    }

    public Map<String, Object> analizarPatronesAprendizaje(Long estudianteId) {
        // Implementación de análisis de patrones
    }
}
```

#### Tarea 3.2: Optimización de rendimiento
**Responsable:** Backend Team
**Duración:** 7 días
**Entregables:**
- Optimización de consultas SQL
- Implementación de paginación avanzada
- Configuración de connection pooling
- Pruebas de carga y ajustes

**Implementación:**
```java
// Optimización de consultas con JPA
@Repository
public interface CuestionarioRepository extends JpaRepository<Cuestionario, Long> {

    @Query("SELECT c FROM Cuestionario c " +
           "JOIN FETCH c.preguntas p " +
           "JOIN FETCH p.respuestas " +
           "WHERE c.id = :id")
    Optional<Cuestionario> findByIdWithPreguntasAndRespuestas(@Param("id") Long id);

    @Query(value = "SELECT * FROM cuestionarios " +
                   "WHERE curso_id = :cursoId " +
                   "ORDER BY fecha_creacion DESC " +
                   "LIMIT :limit OFFSET :offset", nativeQuery = true)
    List<Cuestionario> findByCursoIdPaginated(@Param("cursoId") Long cursoId,
                                             @Param("limit") int limit,
                                             @Param("offset") int offset);
}
```

#### Tarea 3.3: Implementar sistema de recomendaciones
**Responsable:** Backend + ML Team
**Duración:** 8 días
**Entregables:**
- Motor de recomendaciones básico
- Recomendaciones basadas en progreso
- Recomendaciones basadas en desempeño

**Implementación:**
```java
// Servicio de recomendaciones
@Service
public class RecomendacionService {

    @Autowired
    private InscripcionRepository inscripcionRepository;

    @Autowired
    private RecursoRepository recursoRepository;

    public List<Recurso> recomendarRecursos(Long estudianteId, Long cursoId) {
        // Obtener progreso del estudiante
        Inscripcion inscripcion = inscripcionRepository.findByEstudianteIdAndCursoId(estudianteId, cursoId)
            .orElseThrow(() -> new EntityNotFoundException("Inscripción no encontrada"));

        // Obtener recursos relevantes para el curso
        List<Recurso> recursosCurso = recursoRepository.findByCursoId(cursoId);

        // Filtrar recursos basados en progreso y desempeño
        return recursosCurso.stream()
            .filter(recurso -> esRelevanteParaProgreso(recurso, inscripcion.getProgreso()))
            .sorted(Comparator.comparing(this::calcularPuntuacionRelevancia).reversed())
            .limit(5)
            .collect(Collectors.toList());
    }

    private boolean esRelevanteParaProgreso(Recurso recurso, int progreso) {
        // Lógica para determinar relevancia basada en progreso
        return true;
    }

    private double calcularPuntuacionRelevancia(Recurso recurso) {
        // Lógica para calcular puntuación de relevancia
        return 0.0;
    }
}
```

## Implementación de Endpoints Nuevos

### Endpoints para SCORM/QTI
```java
// Nuevos endpoints en CuestionarioController
@RestController
@RequestMapping("/api/cuestionarios")
public class CuestionarioController {

    @Autowired
    private CuestionarioService cuestionarioService;

    @PostMapping("/{id}/import-qti")
    @PreAuthorize("hasRole('PROFESOR')")
    public ResponseEntity<Cuestionario> importQti(@PathVariable Long id, @RequestBody QtiImportRequest request) {
        Cuestionario cuestionario = cuestionarioService.importQtiPackage(request.getQtiXml());
        return ResponseEntity.ok(cuestionario);
    }

    @GetMapping("/{id}/export-qti")
    @PreAuthorize("hasRole('PROFESOR')")
    public ResponseEntity<String> exportQti(@PathVariable Long id) {
        String qtiXml = cuestionarioService.exportQtiPackage(id);
        return ResponseEntity.ok(qtiXml);
    }
}

// Nuevos endpoints en CursoController
@RestController
@RequestMapping("/api/cursos")
public class CursoController {

    @Autowired
    private ScormService scormService;

    @PostMapping("/import-scorm")
    @PreAuthorize("hasRole('PROFESOR')")
    public ResponseEntity<String> importScorm(@RequestParam("file") MultipartFile file) {
        try {
            String result = scormService.importScormPackage(file);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Error al importar paquete SCORM");
        }
    }

    @GetMapping("/{id}/export-scorm")
    @PreAuthorize("hasRole('PROFESOR')")
    public ResponseEntity<byte[]> exportScorm(@PathVariable Long id) {
        byte[] scormPackage = scormService.exportScormPackage(id);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"curso_" + id + ".scorm\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(scormPackage);
    }
}
```

### Endpoints para Analítica Avanzada
```java
// Nuevos endpoints en EstadisticasController
@RestController
@RequestMapping("/api/estadisticas")
public class EstadisticasController {

    @Autowired
    private AnaliticaService analiticaService;

    @GetMapping("/mapa-calor/{cursoId}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getMapaCalor(@PathVariable Long cursoId) {
        Map<String, Object> mapaCalor = analiticaService.generarMapaCalor(cursoId);
        return ResponseEntity.ok(mapaCalor);
    }

    @GetMapping("/patrones-aprendizaje/{estudianteId}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN') or #estudianteId == authentication.principal.id")
    public ResponseEntity<Map<String, Object>> getPatronesAprendizaje(@PathVariable Long estudianteId) {
        Map<String, Object> patrones = analiticaService.analizarPatronesAprendizaje(estudianteId);
        return ResponseEntity.ok(patrones);
    }

    @GetMapping("/recomendaciones/{estudianteId}/curso/{cursoId}")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Recurso>> getRecomendaciones(
            @PathVariable Long estudianteId,
            @PathVariable Long cursoId) {
        List<Recurso> recomendaciones = analiticaService.recomendarRecursos(estudianteId, cursoId);
        return ResponseEntity.ok(recomendaciones);
    }
}
```

## Configuración Adicional

### Configuración de Redis para Caching
```properties
# application.properties
spring.cache.type=redis
spring.redis.host=localhost
spring.redis.port=6379
spring.cache.redis.time-to-live=3600000
spring.cache.redis.cache-null-values=false
```

### Configuración de Caching
```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(1))
                .disableCachingNullValues()
                .serializeValuesWith(
                    RedisSerializationContext.SerializationPair.fromSerializer(
                        new GenericJackson2JsonRedisSerializer()
                    )
                );
    }

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(cacheConfiguration())
                .build();
    }
}
```

## Pruebas y Validación

### Plan de Pruebas
1. **Pruebas Unitarias**: Para cada nuevo servicio y método
2. **Pruebas de Integración**: Para flujos completos (import/export SCORM/QTI)
3. **Pruebas de Rendimiento**: Comparar métricas antes/después de caching
4. **Pruebas de Accesibilidad**: Validar cumplimiento WCAG 2.1
5. **Pruebas de Usuario**: Validar nuevas funcionalidades con usuarios reales

### Métricas de Éxito
- **Rendimiento**: Reducción del 40% en tiempos de respuesta de endpoints críticos
- **Interoperabilidad**: 100% de compatibilidad con paquetes SCORM 1.2 y QTI 2.1
- **Accesibilidad**: Cumplimiento del 90% de criterios WCAG 2.1 nivel AA
- **Analítica**: Generación de informes avanzados en menos de 2 segundos
- **Satisfacción**: Incremento del 25% en satisfacción de usuarios (encuestas)

## Cronograma Detallado

| Semana | Sprint | Actividades Principales |
|--------|--------|------------------------|
| 1-2 | Sprint 1 | Caching, accesibilidad básica, documentación inicial |
| 3-4 | Sprint 2 | SCORM/QTI completo, lecciones individuales |
| 5-7 | Sprint 3 | Analítica avanzada, optimización, recomendaciones |
| 8 | Testing | Pruebas completas y ajustes finales |

## Recursos Necesarios

### Humanos
- 2 Desarrolladores Backend (Java/Spring)
- 2 Desarrolladores Frontend (React/Next.js)
- 1 Arquitecto de Software
- 1 Especialista en QA
- 1 Diseñador UX/UI (para accesibilidad)

### Técnicos
- Servidor Redis para caching
- Base de datos optimizada (PostgreSQL con índices adecuados)
- Herramientas de prueba de carga (JMeter, Gatling)
- Herramientas de validación de accesibilidad (axe, WAVE)

## Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Complejidad en SCORM/QTI | Media | Alto | Usar bibliotecas existentes, pruebas exhaustivas |
| Problemas de rendimiento | Baja | Alto | Implementar caching primero, monitoreo continuo |
| Cambios en requisitos | Media | Medio | Reuniones semanales de alineación |
| Falta de recursos | Baja | Alto | Priorizar tareas críticas, escalar según necesidad |

## Conclusión

Este plan de acción proporciona una hoja de ruta clara para implementar las mejoras identificadas en el proyecto EVA 2.0. Con una inversión de aproximadamente 7 semanas de desarrollo, el sistema podría alcanzar un **95% de cumplimiento** de los requisitos originales, mejorando significativamente su valor educativo y técnico.

La implementación prioriza mejoras de alto impacto con bajo esfuerzo inicial, asegurando resultados visibles desde las primeras semanas. El enfoque modular permite implementaciones incrementales sin afectar la funcionalidad existente.