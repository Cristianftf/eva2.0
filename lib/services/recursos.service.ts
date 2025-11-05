import { apiService } from "./api.service"
import { API_ENDPOINTS } from "@/lib/config/api.config"
import type { RecursoConfiable, ApiResponse } from "@/lib/types"

class RecursosService {
  // Obtener todos los recursos
  async getAll(): Promise<ApiResponse<RecursoConfiable[]>> {
    return apiService.get<RecursoConfiable[]>(API_ENDPOINTS.resources.base)
  }

  // Obtener recurso por ID
  async getById(id: string): Promise<ApiResponse<RecursoConfiable>> {
    return apiService.get<RecursoConfiable>(API_ENDPOINTS.resources.byId(id))
  }

  // Obtener recursos por categoría
  async getByCategoria(categoria: string): Promise<ApiResponse<RecursoConfiable[]>> {
    return apiService.get<RecursoConfiable[]>(API_ENDPOINTS.resources.byCategoria(categoria))
  }

  // Crear nuevo recurso (solo admin)
  async create(data: Omit<RecursoConfiable, "id" | "fechaCreacion">): Promise<ApiResponse<RecursoConfiable>> {
    return apiService.post<RecursoConfiable>(API_ENDPOINTS.resources.base, data)
  }

  // Actualizar recurso (solo admin)
  async update(id: string, data: Partial<RecursoConfiable>): Promise<ApiResponse<RecursoConfiable>> {
    return apiService.put<RecursoConfiable>(API_ENDPOINTS.resources.byId(id), data)
  }

  // Eliminar recurso (solo admin)
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(API_ENDPOINTS.resources.byId(id))
  }
}

export const recursosService = new RecursosService()
