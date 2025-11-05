import { apiService } from "./api.service"
import { API_ENDPOINTS } from "@/lib/config/api.config"
import type { ApiResponse } from "@/lib/types"

export interface InformeCurso {
  id: string
  cursoId: string
  cursoTitulo: string
  totalEstudiantes: number
  promedioProgreso: number
  promedioCalificaciones: number
  fechaGeneracion: string
}

class InformesService {
  // Obtener informe de curso
  async getCurso(cursoId: string): Promise<ApiResponse<InformeCurso>> {
    return apiService.get<InformeCurso>(API_ENDPOINTS.reports.curso(cursoId))
  }

  // Obtener informes de profesor
  async getProfesor(profesorId: string): Promise<ApiResponse<InformeCurso[]>> {
    return apiService.get<InformeCurso[]>(API_ENDPOINTS.reports.profesor(profesorId))
  }

  // Obtener informe de estudiante en un curso
  async getEstudiante(estudianteId: string, cursoId: string): Promise<ApiResponse<any>> {
    return apiService.get<any>(API_ENDPOINTS.reports.estudiante(estudianteId, cursoId))
  }
}

export const informesService = new InformesService()
