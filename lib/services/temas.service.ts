import { apiService } from "./api.service"
import { API_ENDPOINTS } from "@/lib/config/api.config"
import type { Tema, ApiResponse } from "@/lib/types"

// DTO para crear temas
export interface CreateTemaDto {
  titulo: string
  descripcion: string
  orden: number
  cursoId: string
}

class TemasService {
  // Obtener todos los temas
  async getAll(): Promise<ApiResponse<Tema[]>> {
    return apiService.get<Tema[]>(API_ENDPOINTS.topics.base)
  }

  // Obtener tema por ID
  async getById(id: string): Promise<ApiResponse<Tema>> {
    return apiService.get<Tema>(API_ENDPOINTS.topics.byId(id))
  }

  // Obtener temas por curso
  async getByCurso(cursoId: string): Promise<ApiResponse<Tema[]>> {
    return apiService.get<Tema[]>(API_ENDPOINTS.topics.byCurso(cursoId))
  }

  // Crear nuevo tema con cursoId
  async create(data: CreateTemaDto): Promise<ApiResponse<Tema>> {
    return apiService.post<Tema>(API_ENDPOINTS.topics.base, data)
  }

  // Actualizar tema
  async update(id: string, data: Partial<Tema>): Promise<ApiResponse<Tema>> {
    return apiService.put<Tema>(API_ENDPOINTS.topics.byId(id), data)
  }

  // Eliminar tema
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(API_ENDPOINTS.topics.byId(id))
  }
}

export const temasService = new TemasService()