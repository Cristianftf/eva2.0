// Servicio de autenticación

import { apiService } from "./api.service"
import { API_ENDPOINTS } from "@/lib/config/api.config"
import type { LoginCredentials, RegisterData, AuthResponse, User, ApiResponse } from "@/lib/types"

class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.login, credentials)

    if (response.success && response.data) {
      apiService.saveToken(response.data.token)
    }

    return response
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.register, data)

    if (response.success && response.data) {
      apiService.saveToken(response.data.token)
    }

    return response
  }

  async logout(): Promise<void> {
    try {
      await apiService.post(API_ENDPOINTS.auth.logout)
    } finally {
      apiService.clearToken()
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiService.get<User>(API_ENDPOINTS.auth.me)
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.refresh)

    if (response.success && response.data) {
      apiService.saveToken(response.data.token)
    }

    return response
  }

  isAuthenticated(): boolean {
    return apiService.hasToken()
  }

  async actualizarPerfil(data: Partial<User>): Promise<User> {
    const response = await apiService.put<User>(API_ENDPOINTS.auth.me, data)
    if (!response.success || !response.data) {
      throw new Error(response.error || "Error al actualizar perfil")
    }
    return response.data
  }

  async cambiarPassword(passwordActual: string, passwordNueva: string): Promise<void> {
    const response = await apiService.post(API_ENDPOINTS.auth.changePassword, {
      passwordActual,
      passwordNueva,
    })
    if (!response.success) {
      throw new Error(response.error || "Error al cambiar contraseña")
    }
  }

  async subirFotoPerfil(file: File): Promise<User> {
    const formData = new FormData()
    formData.append("foto", file)

    const response = await apiService.uploadFile<User>(API_ENDPOINTS.auth.uploadPhoto, formData)
    if (!response.success || !response.data) {
      throw new Error(response.error || "Error al subir foto")
    }
    return response.data
  }
}

export const authService = new AuthService()
