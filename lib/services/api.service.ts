// Servicio base para hacer peticiones HTTP al backend de Spring

import { API_BASE_URL, API_TIMEOUT, getAuthHeaders } from "@/lib/config/api.config"
import type { ApiResponse } from "@/lib/types"

class ApiService {
  private baseUrl: string
  private timeout: number

  constructor() {
    this.baseUrl = API_BASE_URL
    this.timeout = API_TIMEOUT
  }

  // Obtener token del localStorage
  private getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth_token")
  }

  // Guardar token en localStorage
  private setToken(token: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem("auth_token", token)
  }

  // Eliminar token del localStorage
  private removeToken(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem("auth_token")
  }

  // Método genérico para hacer peticiones
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = this.getToken()
    const url = `${this.baseUrl}${endpoint}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(token || undefined),
          ...options.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Manejar respuestas sin contenido
      if (response.status === 204) {
        return { success: true, data: undefined as T }
      }

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || "Error en la petición",
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            success: false,
            error: "La petición ha excedido el tiempo de espera",
          }
        }
        return {
          success: false,
          error: error.message,
        }
      }

      return {
        success: false,
        error: "Error desconocido en la petición",
      }
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "GET",
    })
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    })
  }

  // Método especial para subir archivos
  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, string>): Promise<ApiResponse<T>> {
    const token = this.getToken()
    const url = `${this.baseUrl}${endpoint}`

    const formData = new FormData()
    formData.append("file", file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || "Error al subir archivo",
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: error.message,
        }
      }

      return {
        success: false,
        error: "Error desconocido al subir archivo",
      }
    }
  }

  // Métodos de autenticación
  saveToken(token: string): void {
    this.setToken(token)
  }

  clearToken(): void {
    this.removeToken()
  }

  hasToken(): boolean {
    return !!this.getToken()
  }
}

// Exportar instancia única
export const apiService = new ApiService()
