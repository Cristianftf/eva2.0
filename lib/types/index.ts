// Tipos principales del sistema EduSearch

export type UserRole = "ADMIN" | "PROFESOR" | "ESTUDIANTE"

export interface User {
  id: string
  email: string
  nombre: string
  apellido: string
  rol: UserRole
  fotoPerfil?: string
  fechaRegistro: string
  activo: boolean
}

export interface Curso {
  id: string
  titulo: string
  descripcion: string
  profesorId: string
  profesor?: User
  imagen?: string
  fechaCreacion: string
  fechaActualizacion: string
  activo: boolean
  duracionEstimada?: number // en horas
  nivel?: "basico" | "intermedio" | "avanzado"
}

export interface Tema {
  id: string
  cursoId: string
  titulo: string
  descripcion: string
  orden: number
  contenido: string
  multimedia: MultimediaItem[]
}

export interface MultimediaItem {
  id: string
  temaId: string
  tipo: "video" | "audio" | "documento" | "imagen" | "enlace"
  titulo: string
  url: string
  duracion?: number // para videos y audios en segundos
  tamanio?: number // en bytes
  fechaSubida: string
}

export interface Cuestionario {
  id: string
  cursoId: string
  temaId?: string
  titulo: string
  descripcion: string
  duracionMinutos?: number
  intentosPermitidos: number
  notaMinima: number
  preguntas: Pregunta[]
  activo: boolean
}

export interface Pregunta {
  id: string
  cuestionarioId: string
  texto: string
  tipo: "multiple" | "verdadero_falso" | "abierta"
  opciones?: OpcionPregunta[]
  respuestaCorrecta?: string
  puntos: number
  orden: number
}

export interface OpcionPregunta {
  id: string
  texto: string
  esCorrecta: boolean
}

export interface RespuestaCuestionario {
  id: string
  cuestionarioId: string
  estudianteId: string
  respuestas: RespuestaIndividual[]
  notaObtenida: number
  fechaInicio: string
  fechaFinalizacion?: string
  intento: number
}

export interface RespuestaIndividual {
  preguntaId: string
  respuesta: string
  esCorrecta: boolean
  puntosObtenidos: number
}

export interface Inscripcion {
  id: string
  cursoId: string
  cursoTitulo: string
  cursoDescripcion: string
  estudianteId: string
  estudianteNombre: string
  fechaInscripcion: string
  progreso: number // 0-100
  completado: boolean
  fechaCompletado?: string
  curso?: {
    titulo: string
    descripcion: string
  }
}

export interface Mensaje {
  id: string
  remitenteId: string
  remitente?: User
  destinatarioId?: string
  destinatario?: User
  cursoId?: string
  contenido: string
  fechaEnvio: string
  leido: boolean
  tipo: "directo" | "curso"
}

export interface Notificacion {
  id: string
  usuarioId: string
  titulo: string
  mensaje: string
  tipo: "info" | "exito" | "advertencia" | "error"
  leida: boolean
  fechaCreacion: string
  enlace?: string
}

export interface RecursoConfiable {
  id: string
  titulo: string
  descripcion: string
  url: string
  categoria: string
  imagen?: string
  fechaAgregado: string
}

export interface InformeEstudiante {
  estudianteId: string
  estudiante: User
  cursoId: string
  curso: Curso
  progreso: number
  cuestionariosCompletados: number
  cuestionariosTotales: number
  promedioNotas: number
  tiempoTotal: number // en minutos
  ultimaActividad: string
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
