// Servicio base para hacer peticiones HTTP al backend de Spring

import { API_BASE_URL, API_TIMEOUT, getAuthHeaders } from "@/lib/config/api.config"
import type { ApiResponse } from "@/lib/types"

class ApiService {
  private baseUrl: string
  private timeout: number
  private isRefreshing = false

  constructor() {
    this.baseUrl = API_BASE_URL
    this.timeout = API_TIMEOUT
  }

  // Obtener token de las cookies
  private getToken(): string | null {
    if (typeof window === "undefined") return null
    const cookies = document.cookie.split(";")
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=")
      if (name === "auth_token") {
        return decodeURIComponent(value)
      }
    }
    return null
  }

  // Guardar token en cookies
  private setToken(token: string): void {
    if (typeof window === "undefined") return
    const expires = new Date()
    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 días
    document.cookie = `auth_token=${encodeURIComponent(token)};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  }

  // Eliminar token de las cookies
  private removeToken(): void {
    if (typeof window === "undefined") return
    document.cookie = "auth_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;"
  }

  // Método genérico para hacer peticiones con mejor manejo de errores
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
        credentials: 'include',
      })

      clearTimeout(timeoutId)

      // Manejar respuestas sin contenido
      if (response.status === 204) {
        return { success: true, data: undefined as T }
      }

      let data: any
      try {
        data = await response.json()
      } catch (parseError) {
        // Si no se puede parsear JSON, devolver error
        return {
          success: false,
          error: `Error al procesar respuesta del servidor: ${response.status} ${response.statusText}`,
        }
      }

      if (!response.ok) {
        // Manejar errores específicos
        if (response.status === 400) {
          return {
            success: false,
            error: data.message || "Datos inválidos en la petición",
          }
        }

        if (response.status === 401) {
          // Si 401 y no está refrescando, intentar refresh
          if (!this.isRefreshing) {
            this.isRefreshing = true
            try {
              const refreshResponse = await this.request<{ token: string; user: any }>("/auth/refresh", {
                method: "POST",
              })
              if (refreshResponse.success && refreshResponse.data) {
                this.setToken(refreshResponse.data.token)
                // Retry la petición original
                this.isRefreshing = false
                return this.request<T>(endpoint, options)
              }
            } catch {
              // Falló refresh, continuar con error
            } finally {
              this.isRefreshing = false
            }
          }
          return {
            success: false,
            error: "Sesión expirada. Por favor, inicia sesión nuevamente.",
          }
        }

        if (response.status === 403) {
          return {
            success: false,
            error: "No tienes permisos para realizar esta acción",
          }
        }

        if (response.status === 404) {
          return {
            success: false,
            error: "Recurso no encontrado",
          }
        }

        if (response.status >= 500) {
          return {
            success: false,
            error: "Error interno del servidor. Inténtalo más tarde.",
          }
        }

        return {
          success: false,
          error: data.message || data.error || `Error ${response.status}: ${response.statusText}`,
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
            error: "La petición ha excedido el tiempo de espera. Verifica tu conexión a internet.",
          }
        }

        if (error.name === "TypeError" && error.message.includes("fetch")) {
          return {
            success: false,
            error: "No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.",
          }
        }

        return {
          success: false,
          error: `Error de conexión: ${error.message}`,
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
  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, string | File>): Promise<ApiResponse<T>> {
    const token = this.getToken()
    const url = `${this.baseUrl}${endpoint}`

    const formData = new FormData()
    formData.append("file", file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, value)
        }
      })
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
        credentials: 'include',
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
