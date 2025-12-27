// Tipos principales del sistema EduSearch

export type UserRole = "ADMIN" | "PROFESOR" | "ESTUDIANTE"

export interface User {
  id: string | number  // Normalizado: puede ser string (UUID) o number (Long)
  email: string
  nombre: string
  apellido: string
  rol: UserRole
  fotoPerfil?: string
  fechaRegistro: string  // ISO 8601 string
  activo: boolean
  lastSeen?: string  // ISO 8601 string - campo adicional del backend
  password?: string  // Solo para operaciones de creación/actualización
}

export interface Curso {
  id: string | number  // Normalizado: compatible con backend Long
  titulo: string
  descripcion: string
  objetivos?: string  // Campo adicional del backend
  profesorId: string | number  // Normalizado
  profesor?: User
  imagen?: string
  fechaCreacion: string  // ISO 8601 string
  fechaActualizacion?: string  // ISO 8601 string
  activo: boolean
  duracionEstimada?: number // en horas
  nivel?: "basico" | "intermedio" | "avanzado"  // Normalizado para coincidir con backend
  categoria?: string  // Campo adicional del backend
  metadataLom?: string  // Campo adicional del backend
}

export interface Tema {
  id: string | number  // Normalizado: compatible con backend Long
  cursoId: string | number  // Normalizado
  titulo: string
  descripcion: string
  orden: number
  contenido: string  // Campo que faltaba en backend
  multimedia: MultimediaItem[]
}

export interface MultimediaItem {
  id: string | number  // Normalizado: compatible con backend Long
  temaId: string | number  // Normalizado
  tipo: "video" | "audio" | "documento" | "imagen" | "enlace"  // Normalizado para coincidir con backend
  titulo: string  // Campo calculado: nombreArchivo del backend
  nombreArchivo: string  // Campo original del backend
  url: string  // Campo original: urlArchivo del backend
  urlArchivo: string  // Campo original del backend
  duracion?: number // para videos y audios en segundos
  tamanio?: number // en bytes
  fechaSubida: string  // ISO 8601 string
}

export interface Cuestionario {
  id: string | number  // Normalizado: compatible con backend Long
  cursoId: string | number  // Normalizado
  temaId?: string | number  // Normalizado
  titulo: string
  descripcion: string
  duracionMinutos?: number
  intentosPermitidos?: number  // Campo calculado (default: 3)
  notaMinima?: number  // Campo calculado (default: 70)
  preguntas: Pregunta[]
  activo: boolean
  qtiPayload?: string  // Campo adicional del backend
}

export interface Pregunta {
  id: string | number  // Normalizado: compatible con backend Long
  cuestionarioId: string | number  // Normalizado
  texto: string  // Campo calculado: textoPregunta del backend
  textoPregunta: string  // Campo original del backend
  tipo: "multiple" | "verdadero_falso" | "abierta"  // Normalizado para coincidir con backend
  tipoPregunta: string  // Campo original del backend
  opciones?: OpcionPregunta[]  // Mapeado desde respuestas del backend
  respuestaCorrecta?: string
  puntos?: number  // Campo calculado
  orden?: number  // Campo calculado
  configuracionAdicional?: string  // Campo adicional del backend
}

export interface OpcionPregunta {
  id: string | number  // Normalizado: compatible con backend Long
  texto: string  // Campo calculado: textoRespuesta del backend
  textoRespuesta: string  // Campo original del backend
  valor?: string  // Campo adicional del backend para completar texto
  orden?: number  // Campo adicional del backend para ordenar
  grupo?: string  // Campo adicional del backend para arrastrar/soltar
  configuracionAdicional?: string  // Campo adicional del backend
  esCorrecta: boolean
}

export interface RespuestaCuestionario {
  id: string | number  // Normalizado: compatible con backend Long
  cuestionarioId: string | number  // Normalizado
  estudianteId: string | number  // Normalizado
  respuestas: RespuestaIndividual[]
  notaObtenida: number
  fechaInicio: string  // ISO 8601 string
  fechaFinalizacion?: string  // ISO 8601 string
  intento: number
  fechaCompletado?: string  // Campo adicional del backend
}

export interface RespuestaIndividual {
  preguntaId: string | number  // Normalizado: compatible con backend Long
  respuesta: string | number | number[] | Record<string, any>  // Tipos múltiples soportados
  esCorrecta: boolean
  puntosObtenidos: number
  respuestaId?: string | number  // Campo adicional para respuestas específicas
}

export interface Inscripcion {
  id: string | number  // Normalizado: compatible con backend Long
  cursoId: string | number  // Normalizado
  cursoTitulo: string  // Campo calculado desde curso
  cursoDescripcion: string  // Campo calculado desde curso
  estudianteId: string | number  // Normalizado
  estudianteNombre: string  // Campo calculado: nombre + apellido
  fechaInscripcion: string  // ISO 8601 string
  progreso: number // 0-100
  completado: boolean  // Normalizado para compatibilidad
  fechaCompletado?: string  // ISO 8601 string
  estado: "PENDIENTE" | "APROBADA" | "RECHAZADA" | "COMPLETADO"  // Estado original del backend
  fechaAprobacion?: string  // Campo original del backend  // ISO 8601 string
  curso?: {
    titulo: string
    descripcion: string
  }
}

export interface Mensaje {
  id: string | number  // Normalizado: compatible con backend Long
  remitenteId: string | number  // Normalizado: requerido según backend
  remitente?: User
  destinatarioId?: string | number  // Normalizado
  destinatario?: User
  cursoId?: string | number  // Normalizado
  contenido: string
  fechaEnvio: string  // ISO 8601 string
  leido: boolean
  tipo: "directo" | "curso"  // Determinado por la presencia de cursoId
}

export interface Notificacion {
  id: string | number  // Normalizado: compatible con backend Long
  usuarioId: string | number  // Normalizado
  titulo: string
  mensaje: string
  tipo: "info" | "exito" | "advertencia" | "error"  // Normalizado para compatibilidad
  tipoOriginal?: string  // Campo original del backend
  leida: boolean
  fechaCreacion: string  // ISO 8601 string
  enlace?: string
}

export interface RecursoConfiable {
  id: string | number  // Normalizado: compatible con backend Long
  titulo: string
  descripcion: string
  url: string
  categoria: string
  imagen?: string
  fechaAgregado: string  // ISO 8601 string
}

export interface InformeEstudiante {
  estudianteId: string | number  // Normalizado
  estudiante: User
  cursoId: string | number  // Normalizado
  curso: Curso
  progreso: number
  cuestionariosCompletados: number
  cuestionariosTotales: number
  promedioNotas: number
  tiempoTotal: number // en minutos
  ultimaActividad: string  // ISO 8601 string
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Tipos para autenticación
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  nombre: string
  apellido: string
  rol: UserRole
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}
