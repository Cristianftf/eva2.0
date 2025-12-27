// Mappers para conversión entre DTOs del backend e Interfaces del frontend
import {
  backendIdToString,
  frontendIdToNumber,
  backendDateToString,
  stringToFrontendDate,
  normalizeNivelDificultad,
  normalizeTipoContenido,
  normalizeTipoPregunta,
  normalizeEstadoInscripcion,
  normalizeTipoNotificacion,
  backendRespuestaToOpcionRespuesta,
  opcionRespuestaToBackendRespuesta
} from './type-converters';

// ===== USER MAPPERS =====
export function backendUserToFrontend(user: any): any {
  if (!user) return null;
  
  return {
    id: backendIdToString(user.id),
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    rol: user.rol?.toUpperCase() || 'ESTUDIANTE',
    fotoPerfil: user.fotoPerfil,
    fechaRegistro: backendDateToString(user.fechaRegistro),
    activo: user.activo !== false,
    lastSeen: backendDateToString(user.lastSeen)
  };
}

export function frontendUserToBackend(user: any): any {
  if (!user) return null;
  
  return {
    id: frontendIdToNumber(user.id),
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    rol: user.rol,
    password: user.password,
    fotoPerfil: user.fotoPerfil,
    activo: user.activo,
    fechaRegistro: user.fechaRegistro ? new Date(user.fechaRegistro) : new Date(),
    lastSeen: user.lastSeen ? new Date(user.lastSeen) : new Date()
  };
}

// ===== CURSO MAPPERS =====
export function backendCursoToFrontend(curso: any): any {
  if (!curso) return null;
  
  return {
    id: backendIdToString(curso.id),
    titulo: curso.titulo,
    descripcion: curso.descripcion,
    objetivos: curso.objetivos || '',
    profesorId: backendIdToString(curso.profesor?.id),
    profesor: curso.profesor ? backendUserToFrontend(curso.profesor) : undefined,
    imagen: curso.imagen,
    fechaCreacion: backendDateToString(curso.fechaCreacion),
    fechaActualizacion: backendDateToString(curso.fechaActualizacion),
    activo: curso.activo !== false,
    duracionEstimada: curso.duracionEstimada,
    nivel: normalizeNivelDificultad(curso.nivel),
    categoria: curso.categoria,
    metadataLom: curso.metadataLom
  };
}

export function frontendCursoToBackend(curso: any): any {
  if (!curso) return null;
  
  return {
    id: frontendIdToNumber(curso.id),
    titulo: curso.titulo,
    descripcion: curso.descripcion,
    objetivos: curso.objetivos || '',
    duracionEstimada: curso.duracionEstimada,
    nivel: curso.nivel?.toUpperCase(),
    categoria: curso.categoria,
    activo: curso.activo,
    metadataLom: curso.metadataLom,
    profesor: curso.profesorId ? { id: frontendIdToNumber(curso.profesorId) } : null,
    fechaCreacion: curso.fechaCreacion ? new Date(curso.fechaCreacion) : new Date()
  };
}

// ===== PREGUNTA MAPPERS =====
export function backendPreguntaToFrontend(pregunta: any): any {
  if (!pregunta) return null;
  
  return {
    id: backendIdToString(pregunta.id),
    texto: pregunta.textoPregunta,
    tipo: normalizeTipoPregunta(pregunta.tipoPregunta),
    tipoDescripcion: getTipoPreguntaDescripcion(pregunta.tipoPregunta),
    configuracionAdicional: pregunta.configuracionAdicional,
    opciones: pregunta.respuestas?.map((resp: any) => backendRespuestaToOpcionRespuesta(resp)) || [],
    cuestionarioId: backendIdToString(pregunta.cuestionario?.id)
  };
}

export function frontendPreguntaToBackend(pregunta: any): any {
  if (!pregunta) return null;
  
  return {
    id: frontendIdToNumber(pregunta.id),
    textoPregunta: pregunta.texto,
    tipoPregunta: pregunta.tipo?.toUpperCase(),
    configuracionAdicional: pregunta.configuracionAdicional,
    cuestionario: pregunta.cuestionarioId ? { id: frontendIdToNumber(pregunta.cuestionarioId) } : null
  };
}

// ===== CUESTIONARIO MAPPERS =====
export function backendCuestionarioToFrontend(cuestionario: any): any {
  if (!cuestionario) return null;
  
  return {
    id: backendIdToString(cuestionario.id),
    cursoId: backendIdToString(cuestionario.curso?.id),
    temaId: cuestionario.temaId ? backendIdToString(cuestionario.temaId) : undefined,
    titulo: cuestionario.titulo,
    descripcion: cuestionario.descripcion,
    duracionMinutos: cuestionario.duracionMinutos,
    intentosPermitidos: cuestionario.intentosPermitidos || 3,
    notaMinima: cuestionario.notaMinima || 70,
    preguntas: cuestionario.preguntas?.map((p: any) => backendPreguntaToFrontend(p)) || [],
    activo: cuestionario.activo !== false
  };
}

export function frontendCuestionarioToBackend(cuestionario: any): any {
  if (!cuestionario) return null;
  
  return {
    id: frontendIdToNumber(cuestionario.id),
    titulo: cuestionario.titulo,
    descripcion: cuestionario.descripcion,
    activo: cuestionario.activo,
    duracionMinutos: cuestionario.duracionMinutos,
    qtiPayload: cuestionario.qtiPayload,
    curso: cuestionario.cursoId ? { id: frontendIdToNumber(cuestionario.cursoId) } : null,
    preguntas: cuestionario.preguntas?.map((p: any) => frontendPreguntaToBackend(p)) || []
  };
}

// ===== INSCRIPCION MAPPERS =====
export function backendInscripcionToFrontend(inscripcion: any): any {
  if (!inscripcion) return null;
  
  const normalizedEstado = normalizeEstadoInscripcion(inscripcion.estado);
  
  return {
    id: backendIdToString(inscripcion.id),
    cursoId: backendIdToString(inscripcion.curso?.id),
    cursoTitulo: inscripcion.curso?.titulo || '',
    cursoDescripcion: inscripcion.curso?.descripcion || '',
    estudianteId: backendIdToString(inscripcion.estudiante?.id),
    estudianteNombre: inscripcion.estudiante ? 
      `${inscripcion.estudiante.nombre} ${inscripcion.estudiante.apellido}`.trim() : '',
    fechaInscripcion: backendDateToString(inscripcion.fechaInscripcion),
    progreso: inscripcion.progreso || 0,
    completado: normalizedEstado.completado,
    fechaCompletado: normalizedEstado.completado ? 
      backendDateToString(inscripcion.fechaAprobacion || inscripcion.fechaInscripcion) : undefined,
    curso: inscripcion.curso ? {
      titulo: inscripcion.curso.titulo,
      descripcion: inscripcion.curso.descripcion
    } : undefined,
    estado: normalizedEstado.estado
  };
}

// ===== MENSAJE MAPPERS =====
export function backendMensajeToFrontend(mensaje: any): any {
  if (!mensaje) return null;
  
  return {
    id: backendIdToString(mensaje.id),
    remitenteId: backendIdToString(mensaje.remitente?.id),
    destinatarioId: mensaje.destinatario ? backendIdToString(mensaje.destinatario.id) : undefined,
    destinatario: mensaje.destinatario ? backendUserToFrontend(mensaje.destinatario) : undefined,
    cursoId: mensaje.curso ? backendIdToString(mensaje.curso.id) : undefined,
    contenido: mensaje.contenido,
    fechaEnvio: backendDateToString(mensaje.fechaEnvio),
    leido: mensaje.leido || false,
    tipo: mensaje.curso ? 'curso' : 'directo'
  };
}

// ===== NOTIFICACION MAPPERS =====
export function backendNotificacionToFrontend(notificacion: any): any {
  if (!notificacion) return null;
  
  return {
    id: backendIdToString(notificacion.id),
    usuarioId: backendIdToString(notificacion.usuario?.id),
    titulo: notificacion.titulo,
    mensaje: notificacion.mensaje,
    tipo: normalizeTipoNotificacion(notificacion.tipo),
    leida: notificacion.leida || false,
    fechaCreacion: backendDateToString(notificacion.fechaCreacion),
    enlace: notificacion.enlace
  };
}

// ===== TEMA MAPPERS =====
export function backendTemaToFrontend(tema: any): any {
  if (!tema) return null;
  
  return {
    id: backendIdToString(tema.id),
    cursoId: backendIdToString(tema.curso?.id),
    titulo: tema.titulo,
    descripcion: tema.descripcion,
    orden: tema.orden,
    contenido: tema.contenido || '',
    multimedia: tema.multimedia?.map((m: any) => backendMultimediaToFrontend(m)) || []
  };
}

export function backendMultimediaToFrontend(multimedia: any): any {
  if (!multimedia) return null;
  
  return {
    id: backendIdToString(multimedia.id),
    temaId: backendIdToString(multimedia.tema?.id),
    tipo: multimedia.tipo,
    titulo: multimedia.nombreArchivo,
    url: multimedia.urlArchivo,
    duracion: multimedia.duracion,
    tamanio: multimedia.tamanio,
    fechaSubida: backendDateToString(multimedia.fechaSubida)
  };
}

// ===== CONTENIDO EDUCATIVO MAPPERS =====
export function backendContenidoEducativoToFrontend(contenido: any): any {
  if (!contenido) return null;
  
  return {
    id: backendIdToString(contenido.id),
    titulo: contenido.titulo,
    descripcion: contenido.descripcion,
    tipoContenido: normalizeTipoContenido(contenido.tipoContenido),
    contenidoHtml: contenido.contenidoHtml,
    ejemplos: contenido.ejemplos,
    ejercicios: contenido.ejercicios,
    orden: contenido.orden,
    activo: contenido.activo !== false,
    nivelDificultad: normalizeNivelDificultad(contenido.nivelDificultad),
    fechaCreacion: backendDateToString(contenido.fechaCreacion),
    fechaActualizacion: backendDateToString(contenido.fechaActualizacion),
    cursoId: backendIdToString(contenido.curso?.id),
    cursoTitulo: contenido.curso?.titulo
  };
}

// ===== RESPUESTA ESTUDIANTE MAPPERS =====
export function frontendRespuestaEstudianteToBackend(respuesta: any): any {
  if (!respuesta) return null;
  
  return {
    preguntaId: frontendIdToNumber(respuesta.preguntaId),
    respuesta: respuesta.respuesta
  };
}

// Helper functions
function getTipoPreguntaDescripcion(tipoPregunta: string): string {
  const descripciones: Record<string, string> = {
    'OPCION_MULTIPLE': 'Opción Múltiple',
    'VERDADERO_FALSO': 'Verdadero/Falso',
    'ARRASTRAR_SOLTAR': 'Arrastrar y Soltar',
    'COMPLETAR_TEXTO': 'Completar Texto',
    'ORDENAR_ELEMENTOS': 'Ordenar Elementos'
  };
  
  return descripciones[tipoPregunta] || tipoPregunta;
}