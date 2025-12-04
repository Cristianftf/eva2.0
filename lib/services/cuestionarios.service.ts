import { apiService } from "./api.service"
import { API_ENDPOINTS } from "@/lib/config/api.config"
import type { Cuestionario, RespuestaCuestionario, ApiResponse } from "@/lib/types"

class CuestionariosService {
  // Obtener todos los cuestionarios
  async getAll(): Promise<ApiResponse<Cuestionario[]>> {
    return apiService.get<Cuestionario[]>(API_ENDPOINTS.quizzes.base)
  }

  // Obtener cuestionario por ID
  async getById(id: string): Promise<ApiResponse<Cuestionario>> {
    return apiService.get<Cuestionario>(API_ENDPOINTS.quizzes.byId(id))
  }

  // Obtener cuestionarios por curso
  async getByCurso(cursoId: string): Promise<ApiResponse<Cuestionario[]>> {
    return apiService.get<Cuestionario[]>(API_ENDPOINTS.quizzes.byCurso(cursoId))
  }

  // Obtener preguntas de un cuestionario
  async getPreguntas(cuestionarioId: string): Promise<ApiResponse<any[]>> {
    return apiService.get<any[]>(`${API_ENDPOINTS.quizzes.base}/${cuestionarioId}/preguntas`)
  }

  // Crear nuevo cuestionario
  async create(data: Omit<Cuestionario, "id" | "fechaCreacion">): Promise<ApiResponse<Cuestionario>> {
    return apiService.post<Cuestionario>(API_ENDPOINTS.quizzes.base, data)
  }

  // Responder cuestionario
  async responder(
    cuestionarioId: string,
    respuestas: { respuestas: Array<{ preguntaId: number; respuestaId: number }> },
  ): Promise<ApiResponse<{ calificacion: number; aprobado: boolean }>> {
    return apiService.post(API_ENDPOINTS.quizzes.submit(cuestionarioId), respuestas)
  }

  // Obtener resultados
  async getResultados(cuestionarioId: string): Promise<ApiResponse<any>> {
    return apiService.get(API_ENDPOINTS.quizzes.resultados(cuestionarioId))
  }

  // Obtener resultados por estudiante
  async getResultadosByEstudiante(estudianteId: string): Promise<ApiResponse<any[]>> {
    return apiService.get<any[]>(API_ENDPOINTS.quizzes.resultadosByEstudiante(estudianteId))
  }

  // Eliminar cuestionario
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(API_ENDPOINTS.quizzes.byId(id))
  }

  async obtenerCuestionario(id: number): Promise<Cuestionario> {
    const response = await apiService.get<Cuestionario>(API_ENDPOINTS.quizzes.byId(id.toString()))
    if (!response.success || !response.data) {
      throw new Error(response.error || "Error al obtener cuestionario")
    }
    return response.data
  }

  async enviarRespuestas(
    cuestionarioId: number,
    respuestas: Array<{ preguntaId: number; respuestaId: number }>,
  ): Promise<{ calificacion: number; aprobado: boolean }> {
    const response = await apiService.post<{ calificacion: number; aprobado: boolean }>(
      API_ENDPOINTS.quizzes.submit(cuestionarioId.toString()),
      { respuestas },
    )
    if (!response.success || !response.data) {
      throw new Error(response.error || "Error al enviar respuestas")
    }
    return response.data
  }
}

export const cuestionariosService = new CuestionariosService()
