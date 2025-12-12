import { apiService } from "./api.service"
import { API_ENDPOINTS } from "@/lib/config/api.config"
import type { Mensaje, ApiResponse } from "@/lib/types"

class MensajesService {
  // Obtener todos los mensajes
  async getAll(): Promise<ApiResponse<Mensaje[]>> {
    return apiService.get<Mensaje[]>(API_ENDPOINTS.messages.base)
  }

  // Obtener mensaje por ID
  async getById(id: string): Promise<ApiResponse<Mensaje>> {
    return apiService.get<Mensaje>(API_ENDPOINTS.messages.byId(id))
  }

  // Obtener conversación entre dos usuarios
  async getConversacion(userId1: string, userId2: string): Promise<ApiResponse<Mensaje[]>> {
    // Ordenar IDs para consistencia en la URL
    const [id1, id2] = [userId1, userId2].sort()
    return apiService.get<Mensaje[]>(API_ENDPOINTS.messages.conversacion(id1, id2))
  }

  // Obtener mensajes de un curso
  async getMensajesCurso(cursoId: string): Promise<ApiResponse<Mensaje[]>> {
    return apiService.get<Mensaje[]>(API_ENDPOINTS.messages.curso(cursoId))
  }

  // Enviar mensaje
  async enviar(data: {
    remitenteId: string
    destinatarioId: string
    contenido: string
    cursoId?: string
  }): Promise<ApiResponse<Mensaje>> {
    return apiService.post<Mensaje>(API_ENDPOINTS.messages.enviar, data)
  }

  // Marcar mensaje como leído
  async marcarLeido(id: string): Promise<ApiResponse<Mensaje>> {
    return apiService.patch<Mensaje>(`${API_ENDPOINTS.messages.base}/${id}/leer`, {})
  }

  // Eliminar mensaje
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(API_ENDPOINTS.messages.byId(id))
  }
}

export const mensajesService = new MensajesService()
