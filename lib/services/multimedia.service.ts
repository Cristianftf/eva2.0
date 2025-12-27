import { apiService } from "./api.service"
import { API_ENDPOINTS } from "@/lib/config/api.config"
import type { MultimediaItem, ApiResponse } from "@/lib/types"

class MultimediaService {
  // Obtener todos los archivos multimedia
  async getAll(): Promise<ApiResponse<MultimediaItem[]>> {
    return apiService.get<MultimediaItem[]>(API_ENDPOINTS.multimedia.base)
  }

  // Obtener multimedia por ID
  async getById(id: string | number): Promise<ApiResponse<MultimediaItem>> {
    return apiService.get<MultimediaItem>(API_ENDPOINTS.multimedia.byId(id.toString()))
  }

  // Obtener multimedia por tema
  async getByTema(temaId: string | number): Promise<ApiResponse<MultimediaItem[]>> {
    return apiService.get<MultimediaItem[]>(API_ENDPOINTS.multimedia.byTema(temaId.toString()))
  }

  // Subir archivo multimedia
  async upload(file: File, temaId: string | number, tipo?: string): Promise<ApiResponse<MultimediaItem>> {
    return apiService.uploadFile<MultimediaItem>(API_ENDPOINTS.multimedia.upload, file, {
      temaId: temaId.toString(),
      ...(tipo && { tipo }),
    })
  }

  // Eliminar multimedia
  async delete(id: string | number): Promise<ApiResponse<void>> {
    return apiService.delete<void>(API_ENDPOINTS.multimedia.byId(id.toString()))
  }
}

export const multimediaService = new MultimediaService()
