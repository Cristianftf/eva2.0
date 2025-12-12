// Tipos para contenido educativo de Competencia Informacional

export interface ContenidoEducativo {
  id: number
  titulo: string
  descripcion: string
  tipoContenido: TipoContenido
  contenidoHtml: string
  ejemplos: string
  ejercicios: string
  orden: number
  activo: boolean
  nivelDificultad: NivelDificultad
  fechaCreacion: string
  fechaActualizacion: string
  cursoId: number
  cursoTitulo?: string
}

export type TipoContenido = 
  | 'OPERADORES_BOOLEANOS'
  | 'CRAAP'
  | 'MOTORES_BUSQUEDA'
  | 'TRUNCAMIENTOS'
  | 'BASES_DATOS_CIENTIFICAS'

export type NivelDificultad = 'BASICO' | 'INTERMEDIO' | 'AVANZADO'

export interface CrearContenidoEducativoDto {
  titulo: string
  descripcion: string
  tipoContenido: TipoContenido
  contenidoHtml: string
  ejemplos?: string
  ejercicios?: string
  orden?: number
  nivelDificultad?: NivelDificultad
  cursoId: number
}

export interface ActualizarContenidoEducativoDto {
  titulo?: string
  descripcion?: string
  tipoContenido?: TipoContenido
  contenidoHtml?: string
  ejemplos?: string
  ejercicios?: string
  orden?: number
  nivelDificultad?: NivelDificultad
  activo?: boolean
}

// Funciones de utilidad
export function getTipoContenidoDisplay(tipo: TipoContenido): string {
  const displays = {
    'OPERADORES_BOOLEANOS': 'Operadores Booleanos',
    'CRAAP': 'Evaluación CRAAP',
    'MOTORES_BUSQUEDA': 'Motores de Búsqueda',
    'TRUNCAMIENTOS': 'Truncamientos y Comodines',
    'BASES_DATOS_CIENTIFICAS': 'Bases de Datos Científicas'
  }
  return displays[tipo] || tipo
}

export function getNivelDificultadDisplay(nivel: NivelDificultad): string {
  const displays = {
    'BASICO': 'Básico',
    'INTERMEDIO': 'Intermedio',
    'AVANZADO': 'Avanzado'
  }
  return displays[nivel] || nivel
}

export function getTipoContenidoColor(tipo: TipoContenido): string {
  const colors = {
    'OPERADORES_BOOLEANOS': 'bg-blue-100 text-blue-800',
    'CRAAP': 'bg-green-100 text-green-800',
    'MOTORES_BUSQUEDA': 'bg-purple-100 text-purple-800',
    'TRUNCAMIENTOS': 'bg-orange-100 text-orange-800',
    'BASES_DATOS_CIENTIFICAS': 'bg-red-100 text-red-800'
  }
  return colors[tipo] || 'bg-gray-100 text-gray-800'
}

export function getNivelDificultadColor(nivel: NivelDificultad): string {
  const colors = {
    'BASICO': 'bg-green-100 text-green-800',
    'INTERMEDIO': 'bg-yellow-100 text-yellow-800',
    'AVANZADO': 'bg-red-100 text-red-800'
  }
  return colors[nivel] || 'bg-gray-100 text-gray-800'
}

// Interfaces para simulador de búsqueda
export interface SimulacionBusqueda {
  consulta: string
  operadores: OperadorBooleanos[]
  resultados: ResultadoSimulacion[]
}

export interface OperadorBooleanos {
  tipo: 'AND' | 'OR' | 'NOT'
  terminos: string[]
}

export interface ResultadoSimulacion {
  titulo: string
  descripcion: string
  relevante: boolean
  contieneTerminos: string[]
}

// Interfaces para evaluación CRAAP
export interface EvaluacionCRAAP {
  fuente: string
  currency: { puntuacion: number; comentario: string }
  relevance: { puntuacion: number; comentario: string }
  authority: { puntuacion: number; comentario: string }
  accuracy: { puntuacion: number; comentario: string }
  purpose: { puntuacion: number; comentario: string }
  puntuacionTotal: number
  conclusion: string
}