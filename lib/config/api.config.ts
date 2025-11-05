// Configuración de la API para conectar con Spring Backend

// URL base del backend de Spring Framework
// Cambiar según tu configuración local
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
    changePassword: "/auth/cambiar-password",
    uploadPhoto: "/auth/subir-foto",
  },

  // Usuarios
  users: {
    base: "/usuarios",
    byId: (id: string) => `/usuarios/${id}`,
    byRole: (role: string) => `/usuarios/rol/${role}`,
  },

  // Cursos
  courses: {
    base: "/cursos",
    byId: (id: string) => `/cursos/${id}`,
    byProfesor: (profesorId: string) => `/cursos/profesor/${profesorId}`,
    inscribir: (cursoId: string) => `/cursos/${cursoId}/inscribir`,
    desinscribir: (cursoId: string) => `/cursos/${cursoId}/desinscribir`,
  },

  // Temas
  topics: {
    base: "/temas",
    byId: (id: string) => `/temas/${id}`,
    byCurso: (cursoId: string) => `/temas/curso/${cursoId}`,
  },

  // Multimedia
  multimedia: {
    base: "/multimedia",
    byId: (id: string) => `/multimedia/${id}`,
    byTema: (temaId: string) => `/multimedia/tema/${temaId}`,
    upload: "/multimedia/upload",
  },

  // Cuestionarios
  quizzes: {
    base: "/cuestionarios",
    byId: (id: string) => `/cuestionarios/${id}`,
    byCurso: (cursoId: string) => `/cuestionarios/curso/${cursoId}`,
    submit: (id: string) => `/cuestionarios/${id}/responder`,
    resultados: (id: string) => `/cuestionarios/${id}/resultados`,
  },

  // Inscripciones
  enrollments: {
    base: "/inscripciones",
    byEstudiante: (estudianteId: string) => `/inscripciones/estudiante/${estudianteId}`,
    byCurso: (cursoId: string) => `/inscripciones/curso/${cursoId}`,
    progreso: (id: string) => `/inscripciones/${id}/progreso`,
  },

  // Mensajes/Chat
  messages: {
    base: "/mensajes",
    byId: (id: string) => `/mensajes/${id}`,
    conversacion: (userId1: string, userId2: string) => `/mensajes/conversacion/${userId1}/${userId2}`,
    curso: (cursoId: string) => `/mensajes/curso/${cursoId}`,
    enviar: "/mensajes/enviar",
    marcarLeido: (id: string) => `/mensajes/${id}/leer`,
  },

  // Notificaciones
  notifications: {
    base: "/notificaciones",
    byUsuario: (usuarioId: string) => `/notificaciones/usuario/${usuarioId}`,
    marcarLeida: (id: string) => `/notificaciones/${id}/leer`,
    marcarTodasLeidas: (usuarioId: string) => `/notificaciones/usuario/${usuarioId}/leer-todas`,
  },

  // Recursos Confiables
  resources: {
    base: "/recursos",
    byId: (id: string) => `/recursos/${id}`,
    byCategoria: (categoria: string) => `/recursos/categoria/${categoria}`,
  },

  // Informes
  reports: {
    estudiante: (estudianteId: string, cursoId: string) => `/informes/estudiante/${estudianteId}/curso/${cursoId}`,
    curso: (cursoId: string) => `/informes/curso/${cursoId}`,
    profesor: (profesorId: string) => `/informes/profesor/${profesorId}`,
  },

  // Estadísticas
  stats: {
    base: "/estadisticas",
    general: "/estadisticas/generales",
    activity: "/estadisticas/actividad-reciente",
    profesor: (profesorId: string) => `/estadisticas/profesor/${profesorId}`,
    estudiante: (estudianteId: string) => `/estadisticas/estudiante/${estudianteId}`,
  },
} as const

// Configuración de headers
export const getAuthHeaders = (token?: string) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

// Configuración de timeout
export const API_TIMEOUT = 30000 // 30 segundos
