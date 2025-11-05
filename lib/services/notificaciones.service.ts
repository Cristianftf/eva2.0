import { apiService } from "./api.service"
import { API_ENDPOINTS } from "@/lib/config/api.config"
import type { Notificacion, ApiResponse } from "@/lib/types"

class NotificacionesService {
  // Obtener todas las notificaciones
  async getAll(): Promise<ApiResponse<Notificacion[]>> {
    return apiService.get<Notificacion[]>(API_ENDPOINTS.notifications.base)
  }

  // Obtener notificaciones por usuario
  async getByUsuario(usuarioId: string): Promise<ApiResponse<Notificacion[]>> {
    return apiService.get<Notificacion[]>(API_ENDPOINTS.notifications.byUsuario(usuarioId))
  }

  // Crear notificación
  async create(data: Omit<Notificacion, "id" | "fechaCreacion">): Promise<ApiResponse<Notificacion>> {
    return apiService.post<Notificacion>(API_ENDPOINTS.notifications.base, data)
  }

  // Marcar notificación como leída
  async marcarLeida(id: string): Promise<ApiResponse<Notificacion>> {
    return apiService.patch<Notificacion>(API_ENDPOINTS.notifications.marcarLeida(id), {})
  }

  // Marcar todas las notificaciones como leídas
  async marcarTodasLeidas(usuarioId: string): Promise<ApiResponse<void>> {
    return apiService.patch<void>(API_ENDPOINTS.notifications.marcarTodasLeidas(usuarioId), {})
  }

  // Eliminar notificación
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(API_ENDPOINTS.notifications.base + `/${id}`)
  }
}

export const notificacionesService = new NotificacionesService()
