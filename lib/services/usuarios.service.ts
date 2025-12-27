import { apiService } from "./api.service"
import { API_ENDPOINTS } from "@/lib/config/api.config"
import type { User, ApiResponse } from "@/lib/types"

interface CursosAsociadosInfo {
  usuario: User
  cursosAsociados: number
  profesoresDisponibles: User[]
  puedeEliminarse: boolean
}

interface TransferenciaCursosRequest {
  profesorActualId: string | number
  nuevoProfesorId: string | number
}

interface DeleteUsuarioResponse {
  error?: string
  message?: string
  cursosAsociados?: number
  solucion?: string
  profesoresDisponibles?: number
}

class UsuariosService {
  // Obtener todos los usuarios
  async getAll(): Promise<ApiResponse<User[]>> {
    return apiService.get<User[]>(API_ENDPOINTS.users.base)
  }

  // Obtener usuario por ID
  async getById(id: string): Promise<ApiResponse<User>> {
    return apiService.get<User>(API_ENDPOINTS.users.byId(id))
  }

  // Obtener usuarios por rol
  async getByRole(role: string): Promise<ApiResponse<User[]>> {
    return apiService.get<User[]>(API_ENDPOINTS.users.byRole(role))
  }

  // Obtener contactos para chat
  async getChatContacts(): Promise<ApiResponse<User[]>> {
    return apiService.get<User[]>(API_ENDPOINTS.users.base + "/chat-contacts")
  }

  // Crear nuevo usuario
  async create(data: Omit<User, "id" | "fechaRegistro">): Promise<ApiResponse<User>> {
    return apiService.post<User>(API_ENDPOINTS.users.base, data)
  }

  // Actualizar usuario
  async update(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
    return apiService.put<User>(API_ENDPOINTS.users.byId(id), data)
  }

  // Eliminar usuario con información detallada
  async delete(id: string): Promise<ApiResponse<DeleteUsuarioResponse>> {
    return apiService.delete<DeleteUsuarioResponse>(API_ENDPOINTS.users.byId(id))
  }

  // ✅ NUEVO: Consultar cursos asociados
  async getCursosAsociados(id: string): Promise<ApiResponse<CursosAsociadosInfo>> {
    return apiService.get<CursosAsociadosInfo>(`${API_ENDPOINTS.users.base}/${id}/cursos-asociados`)
  }

  // ✅ NUEVO: Transferir cursos entre profesores
  async transferirCursos(data: TransferenciaCursosRequest): Promise<ApiResponse<{message: string, profesorAnterior: string | number, nuevoProfesor: string | number}>> {
    const { profesorActualId, nuevoProfesorId } = data
    return apiService.post(`${API_ENDPOINTS.users.base}/${profesorActualId}/transferir-cursos?nuevoProfesorId=${nuevoProfesorId}`, {})
  }

  // ✅ NUEVO: Verificar si un usuario puede eliminarse
  async puedeEliminarse(id: string): Promise<ApiResponse<{puedeEliminarse: boolean, cursosAsociados: number}>> {
    const info = await this.getCursosAsociados(id)
    if (info.success && info.data) {
      return {
        success: true,
        data: {
          puedeEliminarse: info.data.puedeEliminarse,
          cursosAsociados: info.data.cursosAsociados
        }
      }
    }
    return info as any
  }
}

export const usuariosService = new UsuariosService()
