"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService } from "@/lib/services/auth.service"
import type { User, LoginCredentials, RegisterData } from "@/lib/types"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const response = await authService.getCurrentUser()
        if (response.success && response.data) {
          setUser(response.data)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials)

    if (response.success && response.data) {
      setUser(response.data.user)
      return { success: true }
    }

    return { success: false, error: response.error }
  }

  const register = async (data: RegisterData) => {
    const response = await authService.register(data)

    if (response.success && response.data) {
      setUser(response.data.user)
      return { success: true }
    }

    return { success: false, error: response.error }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
