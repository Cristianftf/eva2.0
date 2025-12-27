import { apiService } from './api.service'
import type {
  ContenidoEducativo,
  CrearContenidoEducativoDto,
  ActualizarContenidoEducativoDto,
  TipoContenido
} from '@/lib/types/contenido-educativo'

// Re-exportar TipoContenido para uso directo
export type { TipoContenido } from '@/lib/types/contenido-educativo'

class ContenidoEducativoService {
  private readonly baseUrl = '/contenido-educativo'

  /**
   * Crear nuevo contenido educativo
   */
  async crearContenido(datos: CrearContenidoEducativoDto) {
    return apiService.post<ContenidoEducativo>(this.baseUrl, datos)
  }

  /**
   * Obtener contenido educativo por curso
   */
  async obtenerContenidoPorCurso(cursoId: number) {
    return apiService.get<ContenidoEducativo[]>(`${this.baseUrl}/curso/${cursoId}`)
  }

  /**
   * Obtener contenido educativo por tipo
   */
  async obtenerContenidoPorTipo(tipo: TipoContenido) {
    return apiService.get<ContenidoEducativo[]>(`${this.baseUrl}/tipo/${tipo}`)
  }

  /**
   * Obtener contenido educativo por curso y tipo
   */
  async obtenerContenidoPorCursoYTipo(cursoId: number, tipo: TipoContenido) {
    return apiService.get<ContenidoEducativo[]>(`${this.baseUrl}/curso/${cursoId}/tipo/${tipo}`)
  }

  /**
   * Obtener contenido educativo por ID
   */
  async obtenerContenidoPorId(id: number) {
    return apiService.get<ContenidoEducativo>(`${this.baseUrl}/${id}`)
  }

  /**
   * Actualizar contenido educativo
   */
  async actualizarContenido(id: number, datos: ActualizarContenidoEducativoDto) {
    return apiService.put<ContenidoEducativo>(`${this.baseUrl}/${id}`, datos)
  }

  /**
   * Eliminar contenido educativo
   */
  async eliminarContenido(id: number) {
    return apiService.delete<void>(`${this.baseUrl}/${id}`)
  }

  /**
   * Verificar si existe contenido de un tipo específico en un curso
   */
  async existeContenidoPorCursoYTipo(cursoId: number, tipo: TipoContenido) {
    return apiService.get<boolean>(`${this.baseUrl}/curso/${cursoId}/tipo/${tipo}/existe`)
  }

  /**
   * Crear contenido predefinido sobre operadores booleanos
   */
  async crearContenidoOperadoresBooleanos(cursoId: number) {
    return apiService.post<string>(`${this.baseUrl}/curso/${cursoId}/operadores-booleanos`)
  }

  /**
   * Obtener contenido de operadores booleanos por curso
   */
  async obtenerOperadoresBooleanosPorCurso(cursoId: number) {
    return this.obtenerContenidoPorCursoYTipo(cursoId, 'OPERADORES_BOOLEANOS')
  }

  /**
   * Obtener contenido de CRAAP por curso
   */
  async obtenerCraapPorCurso(cursoId: number) {
    return this.obtenerContenidoPorCursoYTipo(cursoId, 'CRAAP')
  }

  /**
   * Obtener contenido de motores de búsqueda por curso
   */
  async obtenerMotoresBusquedaPorCurso(cursoId: number) {
    return this.obtenerContenidoPorCursoYTipo(cursoId, 'MOTORES_BUSQUEDA')
  }

  /**
   * Obtener contenido de truncamientos por curso
   */
  async obtenerTruncamientosPorCurso(cursoId: number) {
    return this.obtenerContenidoPorCursoYTipo(cursoId, 'TRUNCAMIENTOS')
  }

  /**
   * Obtener todo el contenido de CI de un curso
   */
  async obtenerContenidoCICompleto(cursoId: number) {
    const [operadores, craap, motores, truncamientos] = await Promise.all([
      this.obtenerOperadoresBooleanosPorCurso(cursoId),
      this.obtenerCraapPorCurso(cursoId),
      this.obtenerMotoresBusquedaPorCurso(cursoId),
      this.obtenerTruncamientosPorCurso(cursoId)
    ])

    return {
      operadoresBooleanos: operadores.data || [],
      craap: craap.data || [],
      motoresBusqueda: motores.data || [],
      truncamientos: truncamientos.data || []
    }
  }

  /**
   * Crear contenido CRAAP para un curso
   */
  async crearContenidoCraap(cursoId: number) {
    // Por implementar en la siguiente funcionalidad
    return apiService.post<string>(`${this.baseUrl}/curso/${cursoId}/craap`)
  }

  /**
   * Crear contenido sobre motores de búsqueda para un curso
   */
  async crearContenidoMotoresBusqueda(cursoId: number) {
    // Por implementar en la siguiente funcionalidad
    return apiService.post<string>(`${this.baseUrl}/curso/${cursoId}/motores-busqueda`)
  }

  /**
   * Crear contenido sobre truncamientos para un curso
   */
  async crearContenidoTruncamientos(cursoId: number) {
    // Por implementar en la siguiente funcionalidad
    return apiService.post<string>(`${this.baseUrl}/curso/${cursoId}/truncamientos`)
  }
}

export const contenidoEducativoService = new ContenidoEducativoService()
