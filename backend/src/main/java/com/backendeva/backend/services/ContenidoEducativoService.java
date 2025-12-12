package com.backendeva.backend.services;

import com.backendeva.backend.model.ContenidoEducativo;
import com.backendeva.backend.model.Curso;
import com.backendeva.backend.repository.ContenidoEducativoRepository;
import com.backendeva.backend.repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Servicio para manejo de contenido educativo de Competencia Informacional
 */
@Service
@Transactional
public class ContenidoEducativoService {
    
    @Autowired
    private ContenidoEducativoRepository contenidoEducativoRepository;
    
    @Autowired
    private CursoRepository cursoRepository;
    
    /**
     * Guardar contenido educativo
     */
    public ContenidoEducativo guardarContenido(ContenidoEducativo contenido) {
        // Validar que el curso existe
        if (contenido.getCurso() != null && contenido.getCurso().getId() != null) {
            @SuppressWarnings("null")
            Curso curso = cursoRepository.findById(java.util.Objects.requireNonNull(contenido.getCurso().getId()))
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
            contenido.setCurso(curso);
        }
        
        return contenidoEducativoRepository.save(contenido);
    }
    
    /**
     * Obtener todo el contenido educativo de un curso
     */
    @Transactional(readOnly = true)
    public List<ContenidoEducativo> getContenidoByCurso(Long cursoId) {
        return contenidoEducativoRepository.findContenidoEducativoByCurso(cursoId);
    }
    
    /**
     * Obtener contenido por tipo
     */
    @Transactional(readOnly = true)
    public List<ContenidoEducativo> getContenidoByTipo(String tipoContenido) {
        return contenidoEducativoRepository.findByTipoContenidoAndActivoTrue(tipoContenido);
    }
    
    /**
     * Obtener contenido por curso y tipo
     */
    @Transactional(readOnly = true)
    public List<ContenidoEducativo> getContenidoByCursoAndTipo(Long cursoId, String tipoContenido) {
        return contenidoEducativoRepository.findByCursoIdAndTipoContenidoAndActivoTrue(cursoId, tipoContenido);
    }
    
    /**
     * Obtener contenido por ID
     */
    @Transactional(readOnly = true)
    public Optional<ContenidoEducativo> getContenidoById(Long id) {
        @SuppressWarnings("null")
        Optional<ContenidoEducativo> result = contenidoEducativoRepository.findById(java.util.Objects.requireNonNull(id));
        return result;
    }
    
    /**
     * Actualizar contenido educativo
     */
    public ContenidoEducativo actualizarContenido(Long id, ContenidoEducativo contenidoDetails) {
        @SuppressWarnings("null")
        ContenidoEducativo contenido = contenidoEducativoRepository.findById(java.util.Objects.requireNonNull(id))
            .orElseThrow(() -> new RuntimeException("Contenido educativo no encontrado"));
        
        contenido.setTitulo(contenidoDetails.getTitulo());
        contenido.setDescripcion(contenidoDetails.getDescripcion());
        contenido.setTipoContenido(contenidoDetails.getTipoContenido());
        contenido.setContenidoHtml(contenidoDetails.getContenidoHtml());
        contenido.setEjemplos(contenidoDetails.getEjemplos());
        contenido.setEjercicios(contenidoDetails.getEjercicios());
        contenido.setOrden(contenidoDetails.getOrden());
        contenido.setNivelDificultad(contenidoDetails.getNivelDificultad());
        
        return contenidoEducativoRepository.save(contenido);
    }
    
    /**
     * Eliminar contenido educativo (soft delete)
     */
    public void eliminarContenido(Long id) {
        @SuppressWarnings("null")
        ContenidoEducativo contenido = contenidoEducativoRepository.findById(java.util.Objects.requireNonNull(id))
            .orElseThrow(() -> new RuntimeException("Contenido educativo no encontrado"));
        
        contenido.setActivo(false);
        contenidoEducativoRepository.save(contenido);
    }
    
    /**
     * Verificar si existe contenido de un tipo específico en un curso
     */
    @Transactional(readOnly = true)
    public boolean existeContenidoByCursoAndTipo(Long cursoId, String tipo) {
        return contenidoEducativoRepository.existsContenidoByCursoAndTipo(cursoId, tipo);
    }
    
    /**
     * Crear contenido educativo predefinido sobre operadores booleanos
     */
    @SuppressWarnings("null")
    public void crearContenidoOperadoresBooleanos(Long cursoId) {
        if (existeContenidoByCursoAndTipo(cursoId, ContenidoEducativo.OPERADORES_BOOLEANOS)) {
            return; // Ya existe contenido
        }
        
        Curso curso = cursoRepository.findById(java.util.Objects.requireNonNull(cursoId))
            .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
        
        // Crear contenido sobre AND
        ContenidoEducativo and = new ContenidoEducativo();
        and.setTitulo("Operador AND - Búsquedas Específicas");
        and.setDescripcion("Aprende a usar el operador AND para obtener resultados más precisos y específicos");
        and.setTipoContenido(ContenidoEducativo.OPERADORES_BOOLEANOS);
        and.setContenidoHtml(getContenidoHtmlAnd());
        and.setEjemplos(getEjemplosAnd());
        and.setEjercicios(getEjerciciosAnd());
        and.setOrden(1);
        and.setNivelDificultad(ContenidoEducativo.NIVEL_BASICO);
        and.setCurso(curso);
        guardarContenido(and);
        
        // Crear contenido sobre OR
        ContenidoEducativo or = new ContenidoEducativo();
        or.setTitulo("Operador OR - Búsquedas Amplias");
        or.setDescripcion("Descubre cómo usar el operador OR para ampliar el alcance de tus búsquedas");
        or.setTipoContenido(ContenidoEducativo.OPERADORES_BOOLEANOS);
        or.setContenidoHtml(getContenidoHtmlOr());
        or.setEjemplos(getEjemplosOr());
        or.setEjercicios(getEjerciciosOr());
        or.setOrden(2);
        or.setNivelDificultad(ContenidoEducativo.NIVEL_BASICO);
        or.setCurso(curso);
        guardarContenido(or);
        
        // Crear contenido sobre NOT
        ContenidoEducativo not = new ContenidoEducativo();
        not.setTitulo("Operador NOT - Exclusiones Inteligentes");
        not.setDescripcion("Domina el operador NOT para eliminar resultados no deseados");
        not.setTipoContenido(ContenidoEducativo.OPERADORES_BOOLEANOS);
        not.setContenidoHtml(getContenidoHtmlNot());
        not.setEjemplos(getEjemplosNot());
        not.setEjercicios(getEjerciciosNot());
        not.setOrden(3);
        not.setNivelDificultad(ContenidoEducativo.NIVEL_INTERMEDIO);
        not.setCurso(curso);
        guardarContenido(not);
        
        // Crear contenido combinado
        ContenidoEducativo combinado = new ContenidoEducativo();
        combinado.setTitulo("Operadores Combinados - Estrategias Avanzadas");
        combinado.setDescripcion("Aprende a combinar múltiples operadores para búsquedas complejas");
        combinado.setTipoContenido(ContenidoEducativo.OPERADORES_BOOLEANOS);
        combinado.setContenidoHtml(getContenidoHtmlCombinado());
        combinado.setEjemplos(getEjemplosCombinado());
        combinado.setEjercicios(getEjerciciosCombinado());
        combinado.setOrden(4);
        combinado.setNivelDificultad(ContenidoEducativo.NIVEL_AVANZADO);
        combinado.setCurso(curso);
        guardarContenido(combinado);
    }
    
    // Métodos privados para generar contenido HTML
    
    private String getContenidoHtmlAnd() {
        return """
            <h2>El Operador AND</h2>
            <p>El operador <strong>AND</strong> es fundamental para crear búsquedas más específicas y precisas. 
            Cuando usas AND, solo obtendrás resultados que contengan <strong>todos</strong> los términos especificados.</p>
            
            <h3>¿Cómo funciona?</h3>
            <p>La sintaxis básica es: <code>término1 AND término2</code></p>
            
            <h3>Ejemplo práctico:</h3>
            <p><code>inteligencia artificial AND machine learning</code></p>
            <p>Esta búsqueda devolverá únicamente artículos que mencionen tanto "inteligencia artificial" como "machine learning".</p>
            
            <h3>Beneficios del operador AND:</h3>
            <ul>
                <li>Reduce el ruido en los resultados</li>
                <li>Mejora la precisión de la búsqueda</li>
                <li>Enfoca la investigación en temas específicos</li>
                <li>Ideal para investigación académica</li>
            </ul>
            
            <h3>Consejos de uso:</h3>
            <ul>
                <li>Usa términos específicos y bien definidos</li>
                <li>Evita términos demasiado generales</li>
                <li>Combina con otros operadores según sea necesario</li>
            </ul>
            """;
    }
    
    private String getContenidoHtmlOr() {
        return """
            <h2>El Operador OR</h2>
            <p>El operador <strong>OR</strong> amplía el alcance de tu búsqueda incluyendo resultados que contengan 
            <strong>cualquiera</strong> de los términos especificados.</p>
            
            <h3>¿Cómo funciona?</h3>
            <p>La sintaxis básica es: <code>término1 OR término2</code></p>
            
            <h3>Ejemplo práctico:</h3>
            <p><code>neurociencia OR neuropsicología</code></p>
            <p>Esta búsqueda devolverá artículos que mencionen "neurociencia" o "neuropsicología" (o ambos).</p>
            
            <h3>Casos de uso ideales:</h3>
            <ul>
                <li>Buscar sinónimos y términos relacionados</li>
                <li>Explorar diferentes aspectos de un tema</li>
                <li>Ampliar el alcance de la investigación</li>
                <li>Incluir variaciones de términos técnicos</li>
            </ul>
            
            <h3>Ejemplos útiles:</h3>
            <ul>
                <li><code>autismo OR trastorno del espectro autista</code></li>
                <li><code>cáncer OR oncología OR neoplasia</code></li>
                <li><code>depresión OR trastorno depresivo</code></li>
            </ul>
            """;
    }
    
    private String getContenidoHtmlNot() {
        return """
            <h2>El Operador NOT</h2>
            <p>El operador <strong>NOT</strong> (también llamado <code>-</code> en algunos sistemas) 
            te permite excluir términos específicos de tu búsqueda, eliminando resultados no deseados.</p>
            
            <h3>¿Cómo funciona?</h3>
            <p>La sintaxis básica es: <code>término1 NOT término2</code> o <code>término1 -término2</code></p>
            
            <h3>Ejemplo práctico:</h3>
            <p><code>inteligencia artificial NOT videojuegos</code></p>
            <p>Esta búsqueda incluirá artículos sobre IA pero excluirá aquellos que mencionen videojuegos.</p>
            
            <h3>Estrategias efectivas:</h3>
            <ul>
                <li>Excluir contextos no deseados</li>
                <li>Filtrar información irrelevante</li>
                <li>Separar aplicaciones diferentes de un mismo tema</li>
                <li>Eliminar ruido en los resultados</li>
            </ul>
            
            <h3>Ejemplos avanzados:</h3>
            <ul>
                <li><code>machine learning NOT imágenes NOT visión</code></li>
                <li><code>terapia NOT animal -veterinario</code></li>
                <li><code>enfermedad Alzheimer NOT genética</code></li>
            </ul>
            
            <h3>Nota importante:</h3>
            <p>Usa NOT con moderación, ya que puede eliminar información valiosa si se usa en exceso.</p>
            """;
    }
    
    private String getContenidoHtmlCombinado() {
        return """
            <h2>Combinando Operadores Booleanos</h2>
            <p>La verdadera potencia de los operadores booleanos se manifiesta cuando los combinas para crear 
            búsquedas complejas y precisas.</p>
            
            <h3>Reglas de combinación:</h3>
            <ul>
                <li>Usa paréntesis para agrupar operaciones</li>
                <li>Los operadores tienen precedencia: NOT → AND → OR</li>
                <li>Sé específico con la sintaxis</li>
            </ul>
            
            <h3>Ejemplos de combinaciones:</h3>
            
            <h4>Búsqueda básica combinada:</h4>
            <p><code>(inteligencia artificial OR machine learning) AND aplicaciones</code></p>
            
            <h4>Búsqueda compleja:</h4>
            <p><code>(psicología OR psiquiatría) AND (terapia OR tratamiento) NOT (infantil OR pediátrico)</code></p>
            
            <h4>Búsqueda de investigación médica:</h4>
            <p><code>(cáncer OR oncología) AND (tratamiento OR terapia) AND (efectividad OR eficacia) NOT (experimental)</code></p>
            
            <h3>Consejos para búsquedas complejas:</h3>
            <ul>
                <li>Construye la búsqueda paso a paso</li>
                <li>Usa paréntesis para clarificar la lógica</li>
                <li>Prueba y ajusta según los resultados</li>
                <li>Documenta las búsquedas exitosas</li>
            </ul>
            
            <h3>Errores comunes a evitar:</h3>
            <ul>
                <li>Olvidar paréntesis en búsquedas complejas</li>
                <li>Mezclar sinónimos sin usar OR</li>
                <li>Usar NOT en exceso</li>
                <li>No probar variaciones de la búsqueda</li>
            </ul>
            """;
    }
    
    // Métodos para ejemplos
    private String getEjemplosAnd() {
        return """
            <h3>Ejemplos Prácticos del Operador AND</h3>
            <div class="ejemplo">
                <h4>Ejemplo 1: Investigación Médica</h4>
                <p><strong>Búsqueda:</strong> <code>diabetes AND complicaciones</code></p>
                <p><strong>Resultado:</strong> Artículos sobre diabetes que específicamente traten complicaciones.</p>
            </div>
            
            <div class="ejemplo">
                <h4>Ejemplo 2: Tecnología</h4>
                <p><strong>Búsqueda:</strong> <code>blockchain AND seguridad</code></p>
                <p><strong>Resultado:</strong> Artículos sobre blockchain que aborden aspectos de seguridad.</p>
            </div>
            
            <div class="ejemplo">
                <h4>Ejemplo 3: Educación</h4>
                <p><strong>Búsqueda:</strong> <code>aprendizaje automático AND educación</code></p>
                <p><strong>Resultado:</strong> Estudios sobre machine learning aplicado a la educación.</p>
            </div>
            """;
    }
    
    private String getEjemplosOr() {
        return """
            <h3>Ejemplos Prácticos del Operador OR</h3>
            <div class="ejemplo">
                <h4>Ejemplo 1: Sinónimos Médicos</h4>
                <p><strong>Búsqueda:</strong> <code>depresión OR trastorno depresivo OR melancolía</code></p>
                <p><strong>Resultado:</strong> Artículos sobre depresión usando diferentes terminologías.</p>
            </div>
            
            <div class="ejemplo">
                <h4>Ejemplo 2: Tecnologías Emergentes</h4>
                <p><strong>Búsqueda:</strong> <code>realidad virtual OR realidad aumentada OR realidad mixta</code></p>
                <p><strong>Resultado:</strong> Artículos sobre cualquier tipo de realidad extendida.</p>
            </div>
            
            <div class="ejemplo">
                <h4>Ejemplo 3: Campos de Estudio</h4>
                <p><strong>Búsqueda:</strong> <code>neurociencia OR neuropsicología OR neurobiología</code></p>
                <p><strong>Resultado:</strong> Literatura de diferentes ramas de la neurociencia.</p>
            </div>
            """;
    }
    
    private String getEjemplosNot() {
        return """
            <h3>Ejemplos Prácticos del Operador NOT</h3>
            <div class="ejemplo">
                <h4>Ejemplo 1: Exclusión de Contexto</h4>
                <p><strong>Búsqueda:</strong> <code>inteligencia artificial NOT videojuegos</code></p>
                <p><strong>Resultado:</strong> Artículos sobre IA que no mencionen videojuegos.</p>
            </div>
            
            <div class="ejemplo">
                <h4>Ejemplo 2: Filtrado por Población</h4>
                <p><strong>Búsqueda:</strong> <code>terapia NOT infantil</code></p>
                <p><strong>Resultado:</strong> Estudios sobre terapia que no sean específicamente infantiles.</p>
            </div>
            
            <div class="ejemplo">
                <h4>Ejemplo 3: Exclusión de Metodología</h4>
                <p><strong>Búsqueda:</strong> <code>investigación clínica NOT ensayos controlados</code></p>
                <p><strong>Resultado:</strong> Estudios clínicos que no sean ensayos controlados aleatorizados.</p>
            </div>
            """;
    }
    
    private String getEjemplosCombinado() {
        return """
            <h3>Ejemplos de Búsquedas Combinadas</h3>
            <div class="ejemplo">
                <h4>Ejemplo 1: Investigación Farmacológica</h4>
                <p><strong>Búsqueda:</strong> <code>(fármaco OR medicamento) AND (efectividad OR eficacia) NOT (experimental)</code></p>
                <p><strong>Resultado:</strong> Estudios sobre efectividad de fármacos que no sean experimentales.</p>
            </div>
            
            <div class="ejemplo">
                <h4>Ejemplo 2: Psicología Clínica</h4>
                <p><strong>Búsqueda:</strong> <code>(ansiedad OR trastorno de ansiedad) AND (terapia cognitiva OR TCC) AND (adultos OR adolescentes)</code></p>
                <p><strong>Resultado:</strong> Estudios sobre terapia cognitiva para ansiedad en adultos o adolescentes.</p>
            </div>
            
            <div class="ejemplo">
                <h4>Ejemplo 3: Tecnología Educativa</h4>
                <p><strong>Búsqueda:</strong> <code>(tecnología educativa OR edtech) AND (evaluación OR assessment) AND (universidad OR higher education) NOT (primaria OR elementary)</code></p>
                <p><strong>Resultado:</strong> Investigaciones sobre tecnología educativa en educación superior.</p>
            </div>
            """;
    }
    
    // Métodos para ejercicios
    private String getEjerciciosAnd() {
        return """
            <h3>Ejercicios Prácticos - Operador AND</h3>
            
            <div class="ejercicio">
                <h4>Ejercicio 1</h4>
                <p><strong>Tema:</strong> Buscar información sobre efectos secundarios de medicamentos para la presión arterial.</p>
                <p><strong>Tu búsqueda:</strong> ________________</p>
                <p><em>Sugerencia: Incluye términos como "efectos secundarios" y "presión arterial"</em></p>
            </div>
            
            <div class="ejercicio">
                <h4>Ejercicio 2</h4>
                <p><strong>Tema:</strong> Investigar sobre aplicaciones de la inteligencia artificial en el diagnóstico médico.</p>
                <p><strong>Tu búsqueda:</strong> ________________</p>
                <p><em>Sugerencia: Combina "inteligencia artificial" con "diagnóstico médico"</em></p>
            </div>
            
            <div class="ejercicio">
                <h4>Ejercicio 3</h4>
                <p><strong>Tema:</strong> Encontrar estudios sobre metodologías de enseñanza en matemáticas.</p>
                <p><strong>Tu búsqueda:</strong> ________________</p>
                <p><em>Sugerencia: Incluye "metodologías" y "matemáticas"</em></p>
            </div>
            """;
    }
    
    private String getEjerciciosOr() {
        return """
            <h3>Ejercicios Prácticos - Operador OR</h3>
            
            <div class="ejercicio">
                <h4>Ejercicio 1</h4>
                <p><strong>Tema:</strong> Buscar información usando diferentes nombres para trastorno bipolar.</p>
                <p><strong>Tu búsqueda:</strong> ________________</p>
                <p><em>Sugerencia: Incluye "trastorno bipolar", "enfermedad maníaco-depresiva"</em></p>
            </div>
            
            <div class="ejercicio">
                <h4>Ejercicio 2</h4>
                <p><strong>Tema:</strong> Explorar diferentes términos para tecnologías de comunicación inalámbrica.</p>
                <p><strong>Tu búsqueda:</strong> ________________</p>
                <p><em>Sugerencia: Incluye "WiFi", "inalámbrico", "comunicación sin cables"</em></p>
            </div>
            
            <div class="ejercicio">
                <h4>Ejercicio 3</h4>
                <p><strong>Tema:</strong> Buscar información sobre diferentes enfoques terapéuticos para el estrés.</p>
                <p><strong>Tu búsqueda:</strong> ________________</p>
                <p><em>Sugerencia: Incluye "terapia", "tratamiento", "intervención" para estrés</em></p>
            </div>
            """;
    }
    
    private String getEjerciciosNot() {
        return """
            <h3>Ejercicios Prácticos - Operador NOT</h3>
            
            <div class="ejercicio">
                <h4>Ejercicio 1</h4>
                <p><strong>Tema:</strong> Buscar información sobre educación superior, excluyendo educación a distancia.</p>
                <p><strong>Tu búsqueda:</strong> ________________</p>
                <p><em>Sugerencia: Incluye "educación superior" pero excluye "distancia"</em></p>
            </div>
            
            <div class="ejercicio">
                <h4>Ejercicio 2</h4>
                <p><strong>Tema:</strong> Investigar sobre terapia psicológica, excluyendo enfoques farmacológicos.</p>
                <p><strong>Tu búsqueda:</strong> ________________</p>
                <p><em>Sugerencia: Incluye "terapia psicológica" pero excluye "medicamentos"</em></p>
            </div>
            
            <div class="ejercicio">
                <h4>Ejercicio 3</h4>
                <p><strong>Tema:</strong> Buscar sobre aplicaciones de blockchain, excluyendo criptomonedas.</p>
                <p><strong>Tu búsqueda:</strong> ________________</p>
                <p><em>Sugerencia: Incluye "blockchain" pero excluye "criptomonedas"</em></p>
            </div>
            """;
    }
    
    private String getEjerciciosCombinado() {
        return """
            <h3>Ejercicios Prácticos - Operadores Combinados</h3>
            
            <div class="ejercicio">
                <h4>Ejercicio 1</h4>
                <p><strong>Tema:</strong> Buscar estudios sobre efectividad de terapias psicológicas en adultos (no niños).</p>
                <p><strong>Tu búsqueda:</strong> ________________</p>
                <p><em>Tip: Combina OR para tipos de terapia, AND para población, NOT para excluir niños</em></p>
            </div>
            
            <div class="ejercicio">
                <h4>Ejercicio 2</h4>
                <p><strong>Tema:</strong> Investigar sobre aplicaciones de machine learning en medicina (no veterinaria).</p>
                <p><strong>Tu búsqueda:</strong> ________________</p>
                <p><em>Tip: Combina OR para ML, AND para medicina, NOT para excluir veterinaria</em></p>
            </div>
            
            <div class="ejercicio">
                <h4>Ejercicio 3</h4>
                <p><strong>Tema:</strong> Encontrar investigaciones sobre educación inclusiva para diferentes discapacidades.</p>
                <p><strong>Tu búsqueda:</strong> ________________</p>
                <p><em>Tip: Combina OR para tipos de educación inclusiva, AND para discapacidades</em></p>
            </div>
            
            <div class="ejercicio">
                <h4>Ejercicio 4 (Avanzado)</h4>
                <p><strong>Tema:</strong> Búsqueda compleja sobre tratamiento de cáncer usando inmunoterapia o terapia dirigida.</p>
                <p><strong>Tu búsqueda:</strong> ________________</p>
                <p><em>Tip: Usa paréntesis para agrupar términos relacionados con OR</em></p>
            </div>
            """;
    }
}