// Utility functions para conversiones entre frontend y backend
// Este archivo contiene funciones para manejar las inconsistencias de tipos

/**
 * Convierte un ID de backend (Long/number) a string para el frontend
 */
export function backendIdToString(id: number | string | null | undefined): string | null {
  if (id === null || id === undefined) return null;
  return String(id);
}

/**
 * Convierte un ID de frontend (string) a number para el backend
 */
export function frontendIdToNumber(id: string | number | null | undefined): number | null {
  if (id === null || id === undefined) return null;
  if (typeof id === 'number') return id;
  const parsed = parseInt(id, 10);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Convierte fecha de LocalDateTime (backend) a string ISO 8601 (frontend)
 */
export function backendDateToString(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  if (typeof date === 'string') return date;
  return date.toISOString();
}

/**
 * Convierte fecha de string ISO 8601 (frontend) a Date (frontend display)
 */
export function stringToFrontendDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  return new Date(dateString);
}

/**
 * Convierte nivel de dificultad entre frontend y backend
 */
export function normalizeNivelDificultad(nivel: string | null | undefined): string | null {
  if (!nivel) return null;
  
  // Frontend usa: 'basico', 'intermedio', 'avanzado'
  // Backend usa: 'BASICO', 'INTERMEDIO', 'AVANZADO' o 'principiante', 'intermedio', 'avanzado'
  
  const normalized = nivel.toLowerCase();
  
  switch (normalized) {
    case 'basico':
    case 'principiante':
      return 'basico';
    case 'intermedio':
      return 'intermedio';
    case 'avanzado':
      return 'avanzado';
    default:
      return nivel; // Retornar original si no coincide
  }
}

/**
 * Normaliza tipo de contenido educativo
 */
export function normalizeTipoContenido(tipo: string | null | undefined): string | null {
  if (!tipo) return null;
  
  // Los tipos ya están normalizados en ambos lados
  return tipo;
}

/**
 * Convierte enum de tipo pregunta de backend a frontend
 */
export function normalizeTipoPregunta(tipo: string): string {
  const mapping: Record<string, string> = {
    'OPCION_MULTIPLE': 'opcion_multiple',
    'VERDADERO_FALSO': 'verdadero_falso',
    'ARRASTRAR_SOLTAR': 'arrastrar_soltar',
    'COMPLETAR_TEXTO': 'completar_texto',
    'ORDENAR_ELEMENTOS': 'ordenar_elementos'
  };
  
  return mapping[tipo] || tipo.toLowerCase();
}

/**
 * Convierte enum de tipo pregunta de frontend a backend
 */
export function denormalizeTipoPregunta(tipo: string): string {
  const mapping: Record<string, string> = {
    'opcion_multiple': 'OPCION_MULTIPLE',
    'verdadero_falso': 'VERDADERO_FALSO',
    'arrastrar_soltar': 'ARRASTRAR_SOLTAR',
    'completar_texto': 'COMPLETAR_TEXTO',
    'ordenar_elementos': 'ORDENAR_ELEMENTOS'
  };
  
  return mapping[tipo] || tipo.toUpperCase();
}

/**
 * Normaliza estado de inscripción
 */
export function normalizeEstadoInscripcion(estado: string | null): { completado: boolean; estado: string } {
  if (!estado) return { completado: false, estado: 'PENDIENTE' };
  
  switch (estado.toUpperCase()) {
    case 'APROBADA':
    case 'COMPLETADO':
      return { completado: true, estado: 'APROBADA' };
    case 'RECHAZADA':
      return { completado: false, estado: 'RECHAZADA' };
    case 'PENDIENTE':
    default:
      return { completado: false, estado: 'PENDIENTE' };
  }
}

/**
 * Denormaliza estado de inscripción para backend
 */
export function denormalizeEstadoInscripcion(completado: boolean, estado: string): string {
  if (completado) return 'COMPLETADO';
  return estado || 'PENDIENTE';
}

/**
 * Normaliza tipo de notificación
 */
export function normalizeTipoNotificacion(tipo: string | null): string | null {
  if (!tipo) return null;
  
  const normalized = tipo.toLowerCase();
  const mapping: Record<string, string> = {
    'curso': 'info',
    'mensaje': 'info', 
    'sistema': 'info',
    'exito': 'exito',
    'advertencia': 'advertencia',
    'error': 'error',
    'info': 'info'
  };
  
  return mapping[normalized] || 'info';
}

/**
 * Convierte Respuesta backend a OpcionRespuesta frontend
 */
export function backendRespuestaToOpcionRespuesta(respuesta: any): any {
  return {
    id: backendIdToString(respuesta.id),
    texto: respuesta.textoRespuesta || respuesta.valor || '',
    esCorrecta: respuesta.esCorrecta || false
  };
}

/**
 * Convierte OpcionRespuesta frontend a Respuesta backend
 */
export function opcionRespuestaToBackendRespuesta(opcion: any): any {
  return {
    textoRespuesta: opcion.texto,
    esCorrecta: opcion.esCorrecta,
    valor: opcion.texto, // Para preguntas de completar texto
    orden: opcion.orden,
    grupo: opcion.grupo,
    configuracionAdicional: opcion.configuracionAdicional
  };
}