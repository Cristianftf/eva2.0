import { apiService } from "./api.service"
import { API_ENDPOINTS } from "@/lib/config/api.config"
import type { RecursoConfiable, ApiResponse } from "@/lib/types"

// Tipo para crear recurso (sin id ni fechaAgregado)
type CreateRecursoData = {
  titulo: string
  descripcion?: string
  url: string
  categoria?: string
}

class RecursosService {
  // Obtener todos los recursos
  async getAll(): Promise<ApiResponse<RecursoConfiable[]>> {
    return apiService.get<RecursoConfiable[]>(API_ENDPOINTS.resources.base)
  }

  // Obtener recurso por ID
  async getById(id: string | number): Promise<ApiResponse<RecursoConfiable>> {
    return apiService.get<RecursoConfiable>(API_ENDPOINTS.resources.byId(String(id)))
  }

  // Obtener recursos por categoría
  async getByCategoria(categoria: string): Promise<ApiResponse<RecursoConfiable[]>> {
    return apiService.get<RecursoConfiable[]>(API_ENDPOINTS.resources.byCategoria(categoria))
  }

  // Crear nuevo recurso (solo admin)
  async create(data: CreateRecursoData): Promise<ApiResponse<RecursoConfiable>> {
    return apiService.post<RecursoConfiable>(API_ENDPOINTS.resources.base, data)
  }

  // Actualizar recurso (solo admin)
  async update(id: string | number, data: Partial<CreateRecursoData>): Promise<ApiResponse<RecursoConfiable>> {
    return apiService.put<RecursoConfiable>(API_ENDPOINTS.resources.byId(String(id)), data)
  }

  // Eliminar recurso (solo admin)
  async delete(id: string | number): Promise<ApiResponse<void>> {
    return apiService.delete<void>(API_ENDPOINTS.resources.byId(String(id)))
  }
}

export const recursosService = new RecursosService()
