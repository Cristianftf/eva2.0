import { apiService } from "./api.service"
import { API_ENDPOINTS } from "@/lib/config/api.config"
import type { Inscripcion, ApiResponse } from "@/lib/types"

class InscripcionesService {
  // Obtener inscripciones por estudiante
  async getByEstudiante(estudianteId: string): Promise<ApiResponse<Inscripcion[]>> {
    return apiService.get<Inscripcion[]>(API_ENDPOINTS.enrollments.byEstudiante(estudianteId))
  }

  // Obtener inscripciones por curso
  async getByCurso(cursoId: string): Promise<ApiResponse<Inscripcion[]>> {
    return apiService.get<Inscripcion[]>(API_ENDPOINTS.enrollments.byCurso(cursoId))
  }

  // Inscribir estudiante a curso
  async inscribir(cursoId: string, estudianteId: string): Promise<ApiResponse<Inscripcion>> {
    return apiService.post<Inscripcion>(API_ENDPOINTS.courses.inscribir(cursoId), {
      estudianteId,
    })
  }

  // Desinscribir estudiante de curso
  async desinscribir(cursoId: string, estudianteId: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(API_ENDPOINTS.courses.desinscribir(cursoId), {
      estudianteId,
    })
  }

  // Actualizar progreso
  async actualizarProgreso(inscripcionId: string, progreso: number): Promise<ApiResponse<Inscripcion>> {
    return apiService.patch<Inscripcion>(API_ENDPOINTS.enrollments.progreso(inscripcionId), {
      progreso,
    })
  }
}

export const inscripcionesService = new InscripcionesService()
