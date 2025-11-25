import { apiService } from "./api.service"
import { API_ENDPOINTS } from "@/lib/config/api.config"
import type { ApiResponse } from "@/lib/types"

export interface EstadisticasGenerales {
  nuevosUsuarios: number
  cursosActivos: number
  cuestionariosCompletados: number
  actividadMensual: number
}

export interface ActividadReciente {
  id: number
  tipo: string
  descripcion: string
  fecha: string
}

class EstadisticasService {
  // Obtener estadísticas generales
  async getGenerales(): Promise<ApiResponse<EstadisticasGenerales>> {
    return apiService.get<EstadisticasGenerales>(API_ENDPOINTS.stats.general)
  }

  // Obtener actividad reciente
  async getActividadReciente(): Promise<ApiResponse<ActividadReciente[]>> {
    return apiService.get<ActividadReciente[]>(API_ENDPOINTS.stats.activity)
  }

  // Obtener estadísticas de profesor
  async getProfesor(profesorId: string): Promise<ApiResponse<any>> {
    return apiService.get<any>(`${API_ENDPOINTS.stats.base}/profesor/${profesorId}`)
  }

  // Obtener estadísticas de estudiante
  async getEstudiante(estudianteId: string): Promise<ApiResponse<any>> {
    return apiService.get<any>(`${API_ENDPOINTS.stats.base}/estudiante/${estudianteId}`)
  }
}

export const estadisticasService = new EstadisticasService()
