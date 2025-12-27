// Tipos de pregunta soportados en el sistema
// Normalizado para compatibilidad con backend (valores en mayúsculas)
export enum TipoPregunta {
  OPCION_MULTIPLE = 'OPCION_MULTIPLE',
  VERDADERO_FALSO = 'VERDADERO_FALSO',
  ARRASTRAR_SOLTAR = 'ARRASTRAR_SOLTAR',
  COMPLETAR_TEXTO = 'COMPLETAR_TEXTO',
  ORDENAR_ELEMENTOS = 'ORDENAR_ELEMENTOS'
}

// Alias para compatibilidad con frontend existente
export type TipoPreguntaFrontend = 'opcion_multiple' | 'verdadero_falso' | 'arrastrar_soltar' | 'completar_texto' | 'ordenar_elementos'

// Interfaz para respuestas simples (opción múltiple, verdadero/falso)
// Normalizada para compatibilidad con backend
export interface OpcionRespuesta {
  id: string | number  // Normalizado: compatible con backend Long
  texto: string  // Campo calculado: textoRespuesta del backend
  textoRespuesta: string  // Campo original del backend
  valor?: string  // Campo adicional del backend
  orden?: number  // Campo adicional del backend
  grupo?: string  // Campo adicional del backend
  configuracionAdicional?: string  // Campo adicional del backend
  esCorrecta: boolean
}

// Interfaz para preguntas de completar texto
// Normalizada para compatibilidad con backend
export interface RespuestaReferencia {
  id: string | number  // Normalizado: compatible con backend Long
  valor?: string
  texto?: string
}

// Interfaz para preguntas de ordenar elementos
export interface ElementoOrdenar {
  id: number
  texto: string
  ordenCorrecto: number
}

// Interfaz para preguntas de arrastrar y soltar
// Normalizada para compatibilidad con backend
export interface ElementoArrastrar {
  id: string | number  // Normalizado: compatible con backend Long
  texto: string
}

export interface DestinoArrastrar {
  id: string | number  // Normalizado: compatible con backend Long
  texto: string
  elementoCorrecto?: string | number  // Normalizado
}

// Interfaz principal para pregunta con datos específicos por tipo
// Normalizada para compatibilidad con backend
export interface PreguntaData {
  id: string | number  // Normalizado: compatible con backend Long
  texto: string  // Campo calculado: textoPregunta del backend
  textoPregunta: string  // Campo original del backend
  tipo: TipoPregunta  // Normalizado para coincidir con backend
  tipoDescripcion: string
  configuracionAdicional?: string
  cuestionarioId?: string | number  // Campo de relación
  
  // Datos específicos por tipo (solo uno estará presente según el tipo)
  opciones?: OpcionRespuesta[]  // Mapeado desde respuestas del backend
  respuestasReferencia?: RespuestaReferencia[]
  elementosOrdenar?: ElementoOrdenar[]
  elementosArrastrar?: ElementoArrastrar[]
  destinos?: DestinoArrastrar[]
}

// Interfaz para respuestas del estudiante
// Normalizada para compatibilidad con backend
export interface RespuestaEstudiante {
  preguntaId: string | number  // Normalizado: compatible con backend Long
  // La respuesta puede ser de diferentes tipos según la pregunta
  respuesta: number | string | number[] | Record<string, any>
  respuestaId?: string | number  // Campo adicional para respuestas específicas
}

// Interfaz para enviar cuestionario
export interface EnviarCuestionarioData {
  respuestas: RespuestaEstudiante[]
}

// Interfaz para resultado de evaluación
export interface ResultadoEvaluacion {
  calificacion: number
  aprobado: boolean
  respuestasCorrectas: number
  totalPreguntas: number
  detalles?: Record<number, boolean> // preguntaId -> esCorrecta
}

// Interfaces adicionales para compatibilidad
export interface Opcion {
  id: string | number
  texto: string
  esCorrecta: boolean
}

export interface Destino {
  id: string | number
  texto: string
  elementoCorrecto?: string | number
}