-- Migración para crear la tabla de contenido educativo de Competencia Informacional
-- V3__Create_contenido_educativo.sql

-- Crear tabla contenido_educativo
CREATE TABLE contenido_educativo (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo_contenido VARCHAR(50) NOT NULL, -- OPERADORES_BOOLEANOS, CRAAP, MOTORES_BUSQUEDA, TRUNCAMIENTOS, BASES_DATOS_CIENTIFICAS
    contenido_html TEXT,
    ejemplos TEXT,
    ejercicios TEXT,
    orden INTEGER,
    activo BOOLEAN DEFAULT true,
    nivel_dificultad VARCHAR(20), -- BASICO, INTERMEDIO, AVANZADO
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    curso_id BIGINT REFERENCES curso(id)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_contenido_educativo_curso_id ON contenido_educativo(curso_id);
CREATE INDEX idx_contenido_educativo_tipo ON contenido_educativo(tipo_contenido);
CREATE INDEX idx_contenido_educativo_activo ON contenido_educativo(activo);
CREATE INDEX idx_contenido_educativo_orden ON contenido_educativo(curso_id, orden);

-- Insertar contenido educativo de ejemplo para operadores booleanos
-- Solo si existe un curso con ID 1 (asumiendo que es el curso de CI)
INSERT INTO contenido_educativo (titulo, descripcion, tipo_contenido, contenido_html, ejemplos, ejercicios, orden, nivel_dificultad, curso_id)
SELECT 
    'El Operador AND - Búsquedas Específicas',
    'Aprende a usar el operador AND para obtener resultados más precisos y específicos',
    'OPERADORES_BOOLEANOS',
    '<h2>El Operador AND</h2><p>El operador <strong>AND</strong> es fundamental para crear búsquedas más específicas y precisas.</p><h3>¿Cómo funciona?</h3><p>La sintaxis básica es: <code>término1 AND término2</code></p><h3>Ejemplo práctico:</h3><p><code>inteligencia artificial AND machine learning</code></p>',
    '<h3>Ejemplos Prácticos del Operador AND</h3><div class="ejemplo"><h4>Ejemplo 1: Investigación Médica</h4><p><strong>Búsqueda:</strong> <code>diabetes AND complicaciones</code></p><p><strong>Resultado:</strong> Artículos sobre diabetes que específicamente traten complicaciones.</p></div>',
    '<h3>Ejercicios Prácticos - Operador AND</h3><div class="ejercicio"><h4>Ejercicio 1</h4><p><strong>Tema:</strong> Buscar información sobre efectos secundarios de medicamentos para la presión arterial.</p><p><strong>Tu búsqueda:</strong> ________________</p><p><em>Sugerencia: Incluye términos como "efectos secundarios" y "presión arterial"</em></p></div>',
    1,
    'BASICO',
    1
WHERE EXISTS (SELECT 1 FROM curso WHERE id = 1);

INSERT INTO contenido_educativo (titulo, descripcion, tipo_contenido, contenido_html, ejemplos, ejercicios, orden, nivel_dificultad, curso_id)
SELECT 
    'El Operador OR - Búsquedas Amplias',
    'Descubre cómo usar el operador OR para ampliar el alcance de tus búsquedas',
    'OPERADORES_BOOLEANOS',
    '<h2>El Operador OR</h2><p>El operador <strong>OR</strong> amplía el alcance de tu búsqueda incluyendo resultados que contengan <strong>cualquiera</strong> de los términos especificados.</p><h3>¿Cómo funciona?</h3><p>La sintaxis básica es: <code>término1 OR término2</code></p>',
    '<h3>Ejemplos Prácticos del Operador OR</h3><div class="ejemplo"><h4>Ejemplo 1: Sinónimos Médicos</h4><p><strong>Búsqueda:</strong> <code>depresión OR trastorno depresivo OR melancolía</code></p><p><strong>Resultado:</strong> Artículos sobre depresión usando diferentes terminologías.</p></div>',
    '<h3>Ejercicios Prácticos - Operador OR</h3><div class="ejercicio"><h4>Ejercicio 1</h4><p><strong>Tema:</strong> Buscar información usando diferentes nombres para trastorno bipolar.</p><p><strong>Tu búsqueda:</strong> ________________</p><p><em>Sugerencia: Incluye "trastorno bipolar", "enfermedad maníaco-depresiva"</em></p></div>',
    2,
    'BASICO',
    1
WHERE EXISTS (SELECT 1 FROM curso WHERE id = 1);

INSERT INTO contenido_educativo (titulo, descripcion, tipo_contenido, contenido_html, ejemplos, ejercicios, orden, nivel_dificultad, curso_id)
SELECT 
    'El Operador NOT - Exclusiones Inteligentes',
    'Domina el operador NOT para eliminar resultados no deseados',
    'OPERADORES_BOOLEANOS',
    '<h2>El Operador NOT</h2><p>El operador <strong>NOT</strong> (también llamado <code>-</code> en algunos sistemas) te permite excluir términos específicos de tu búsqueda.</p><h3>¿Cómo funciona?</h3><p>La sintaxis básica es: <code>término1 NOT término2</code> o <code>término1 -término2</code></p>',
    '<h3>Ejemplos Prácticos del Operador NOT</h3><div class="ejemplo"><h4>Ejemplo 1: Exclusión de Contexto</h4><p><strong>Búsqueda:</strong> <code>inteligencia artificial NOT videojuegos</code></p><p><strong>Resultado:</strong> Artículos sobre IA que no mencionen videojuegos.</p></div>',
    '<h3>Ejercicios Prácticos - Operador NOT</h3><div class="ejercicio"><h4>Ejercicio 1</h4><p><strong>Tema:</strong> Buscar información sobre educación superior, excluyendo educación a distancia.</p><p><strong>Tu búsqueda:</strong> ________________</p><p><em>Sugerencia: Incluye "educación superior" pero excluye "distancia"</em></p></div>',
    3,
    'INTERMEDIO',
    1
WHERE EXISTS (SELECT 1 FROM curso WHERE id = 1);

INSERT INTO contenido_educativo (titulo, descripcion, tipo_contenido, contenido_html, ejemplos, ejercicios, orden, nivel_dificultad, curso_id)
SELECT 
    'Operadores Combinados - Estrategias Avanzadas',
    'Aprende a combinar múltiples operadores para búsquedas complejas',
    'OPERADORES_BOOLEANOS',
    '<h2>Combinando Operadores Booleanos</h2><p>La verdadera potencia de los operadores booleanos se manifiesta cuando los combinas para crear búsquedas complejas y precisas.</p><h3>Reglas de combinación:</h3><ul><li>Usa paréntesis para agrupar operaciones</li><li>Los operadores tienen precedencia: NOT → AND → OR</li></ul>',
    '<h3>Ejemplos de Búsquedas Combinadas</h3><div class="ejemplo"><h4>Ejemplo 1: Investigación Farmacológica</h4><p><strong>Búsqueda:</strong> <code>(fármaco OR medicamento) AND (efectividad OR eficacia) NOT (experimental)</code></p><p><strong>Resultado:</strong> Estudios sobre efectividad de fármacos que no sean experimentales.</p></div>',
    '<h3>Ejercicios Prácticos - Operadores Combinados</h3><div class="ejercicio"><h4>Ejercicio 1</h4><p><strong>Tema:</strong> Buscar estudios sobre efectividad de terapias psicológicas en adultos (no niños).</p><p><strong>Tu búsqueda:</strong> ________________</p><p><em>Tip: Combina OR para tipos de terapia, AND para población, NOT para excluir niños</em></p></div>',
    4,
    'AVANZADO',
    1
WHERE EXISTS (SELECT 1 FROM curso WHERE id = 1);