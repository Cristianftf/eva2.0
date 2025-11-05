import { apiService } from "./api.service"
import { API_ENDPOINTS } from "@/lib/config/api.config"
import type { Multimedia, ApiResponse } from "@/lib/types"

class MultimediaService {
  // Obtener todos los archivos multimedia
  async getAll(): Promise<ApiResponse<Multimedia[]>> {
    return apiService.get<Multimedia[]>(API_ENDPOINTS.multimedia.base)
  }

  // Obtener multimedia por ID
  async getById(id: string): Promise<ApiResponse<Multimedia>> {
    return apiService.get<Multimedia>(API_ENDPOINTS.multimedia.byId(id))
  }

  // Obtener multimedia por tema
  async getByTema(temaId: string): Promise<ApiResponse<Multimedia[]>> {
    return apiService.get<Multimedia[]>(API_ENDPOINTS.multimedia.byTema(temaId))
  }

  // Subir archivo multimedia
  async upload(file: File, temaId: string, tipo: string): Promise<ApiResponse<Multimedia>> {
    return apiService.uploadFile<Multimedia>(API_ENDPOINTS.multimedia.upload, file, {
      temaId,
      tipo,
    })
  }

  // Eliminar multimedia
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(API_ENDPOINTS.multimedia.byId(id))
  }
}

export const multimediaService = new MultimediaService()
