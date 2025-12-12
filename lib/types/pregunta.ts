// Tipos de pregunta soportados en el sistema
export enum TipoPregunta {
  OPCION_MULTIPLE = 'opcion_multiple',
  VERDADERO_FALSO = 'verdadero_falso',
  ARRASTRAR_SOLTAR = 'arrastrar_soltar',
  COMPLETAR_TEXTO = 'completar_texto',
  ORDENAR_ELEMENTOS = 'ordenar_elementos'
}

// Interfaz para respuestas simples (opción múltiple, verdadero/falso)
export interface OpcionRespuesta {
  id: number
  texto: string
  esCorrecta: boolean
}

// Interfaz para preguntas de completar texto
export interface RespuestaReferencia {
  id: number
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
export interface ElementoArrastrar {
  id: number
  texto: string
}

export interface DestinoArrastrar {
  id: number
  texto: string
  elementoCorrecto?: number
}

// Interfaz principal para pregunta con datos específicos por tipo
export interface PreguntaData {
  id: number
  texto: string
  tipo: TipoPregunta
  tipoDescripcion: string
  configuracionAdicional?: string
  
  // Datos específicos por tipo (solo uno estará presente según el tipo)
  opciones?: OpcionRespuesta[]
  respuestasReferencia?: RespuestaReferencia[]
  elementosOrdenar?: ElementoOrdenar[]
  elementosArrastrar?: ElementoArrastrar[]
  destinos?: DestinoArrastrar[]
}

// Interfaz para respuestas del estudiante
export interface RespuestaEstudiante {
  preguntaId: number
  // La respuesta puede ser de diferentes tipos según la pregunta
  respuesta: number | string | number[] | Record<string, any>
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