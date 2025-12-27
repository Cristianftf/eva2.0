// Utilidades para construcción de URLs de archivos multimedia

import { API_BASE_URL } from "@/lib/config/api.config"

// Extraer la URL base del API (sin /api)
const getBackendBaseUrl = (): string => {
  return API_BASE_URL.replace('/api', '')
}

/**
 * Construye una URL completa para un archivo multimedia
 * @param mediaUrl URL relativa del archivo (ej: /uploads/cursos/2/temas/3/archivo.mp4)
 * @returns URL completa (ej: http://localhost:8080/uploads/cursos/2/temas/3/archivo.mp4)
 */
export const buildMediaUrl = (mediaUrl: string): string => {
  if (!mediaUrl) return ''
  
  // Si ya es una URL absoluta, devolverla tal como está
  if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
    return mediaUrl
  }
  
  // Si es una URL relativa, construir la URL completa
  const backendBaseUrl = getBackendBaseUrl()
  return `${backendBaseUrl}${mediaUrl}`
}

/**
 * Construye URLs completas para una lista de archivos multimedia
 * @param mediaArray Array de objetos multimedia
 * @returns Array de objetos multimedia con URLs completas
 */
export const buildMediaUrls = <T extends { url: string }>(mediaArray: T[]): T[] => {
  return mediaArray.map(item => ({
    ...item,
    url: buildMediaUrl(item.url)
  }))
}

/**
 * Verifica si una URL de archivo multimedia es accesible
 * @param mediaUrl URL del archivo multimedia
 * @returns Promise que resuelve a true si la URL es accesible
 */
export const checkMediaUrlAccessibility = async (mediaUrl: string): Promise<boolean> => {
  try {
    const fullUrl = buildMediaUrl(mediaUrl)
    const response = await fetch(fullUrl, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    console.error('Error checking media URL accessibility:', error)
    return false
  }
}

/**
 * Genera una URL de descarga directa para un archivo multimedia
 * @param mediaUrl URL del archivo multimedia
 * @returns URL de descarga directa
 */
export const buildMediaDownloadUrl = (mediaUrl: string): string => {
  const fullUrl = buildMediaUrl(mediaUrl)
  // Agregar parámetro para forzar descarga
  return `${fullUrl}?download=true`
}

/**
 * Obtiene la extensión del archivo desde la URL
 * @param mediaUrl URL del archivo multimedia
 * @returns Extensión del archivo (ej: 'mp4', 'pdf', 'jpg')
 */
export const getMediaExtension = (mediaUrl: string): string => {
  const filename = mediaUrl.split('/').pop() || ''
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : ''
}

/**
 * Determina el tipo MIME basado en la extensión del archivo
 * @param mediaUrl URL del archivo multimedia
 * @returns Tipo MIME correspondiente
 */
export const getMediaMimeType = (mediaUrl: string): string => {
  const extension = getMediaExtension(mediaUrl)
  
  const mimeTypes: Record<string, string> = {
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'video/ogg',
    'avi': 'video/avi',
    'mov': 'video/quicktime',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'm4a': 'audio/mp4',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    'rtf': 'application/rtf'
  }
  
  return mimeTypes[extension] || 'application/octet-stream'
}