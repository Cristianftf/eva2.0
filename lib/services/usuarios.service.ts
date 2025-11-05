import { apiService } from "./api.service"
import { API_ENDPOINTS } from "@/lib/config/api.config"
import type { Usuario, ApiResponse } from "@/lib/types"

class UsuariosService {
  // Obtener todos los usuarios
  async getAll(): Promise<ApiResponse<Usuario[]>> {
    return apiService.get<Usuario[]>(API_ENDPOINTS.users.base)
  }

  // Obtener usuario por ID
  async getById(id: string): Promise<ApiResponse<Usuario>> {
    return apiService.get<Usuario>(API_ENDPOINTS.users.byId(id))
  }

  // Obtener usuarios por rol
  async getByRole(role: string): Promise<ApiResponse<Usuario[]>> {
    return apiService.get<Usuario[]>(API_ENDPOINTS.users.byRole(role))
  }

  // Crear nuevo usuario
  async create(data: Omit<Usuario, "id" | "fechaRegistro">): Promise<ApiResponse<Usuario>> {
    return apiService.post<Usuario>(API_ENDPOINTS.users.base, data)
  }

  // Actualizar usuario
  async update(id: string, data: Partial<Usuario>): Promise<ApiResponse<Usuario>> {
    return apiService.put<Usuario>(API_ENDPOINTS.users.byId(id), data)
  }

  // Eliminar usuario
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(API_ENDPOINTS.users.byId(id))
  }
}

export const usuariosService = new UsuariosService()
