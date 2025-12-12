// Provider de cache para React Query
"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/lib/context/auth.context"
import { usuariosService } from "@/lib/services/usuarios.service"
import { coursesService } from "@/lib/services/courses.service"
import { recursosService } from "@/lib/services/recursos.service"
import { inscripcionesService } from "@/lib/services/inscripciones.service"
import { authService } from "@/lib/services/auth.service"

interface CacheProviderProps {
  children: React.ReactNode
}

export function CacheProvider({ children }: CacheProviderProps) {
  const queryClient = useQueryClient()
  const { user, isAuthenticated } = useAuth()
  
  // Limpiar cache cuando cambia el usuario (logout)
  useEffect(() => {
    if (!isAuthenticated) {
      queryClient.clear()
      console.log("Cache cleared due to logout")
    }
  }, [isAuthenticated, queryClient])
  
  // Precargar datos críticos cuando se autentica
  useEffect(() => {
    if (user && isAuthenticated) {
      console.log("Preloading critical data for user:", user.id)
      
      // Precargar datos del usuario actual
      queryClient.prefetchQuery({
        queryKey: ["user", "current"],
        queryFn: () => authService.getCurrentUser(),
        staleTime: 5 * 60 * 1000,
      })
      
      // Precargar cursos según el rol
      if (user.rol === "PROFESOR") {
        queryClient.prefetchQuery({
          queryKey: ["courses", "profesor", user.id],
          queryFn: () => coursesService.getCoursesByProfesor(user.id),
          staleTime: 2 * 60 * 1000,
        })
      } else if (user.rol === "ESTUDIANTE") {
        queryClient.prefetchQuery({
          queryKey: ["inscripciones", "estudiante", user.id],
          queryFn: () => inscripcionesService.getByEstudiante(user.id),
          staleTime: 2 * 60 * 1000,
        })
      } else if (user.rol === "ADMIN") {
        // Admin necesita ver todo
        queryClient.prefetchQuery({
          queryKey: ["courses", "all"],
          queryFn: () => coursesService.getAllCourses(),
          staleTime: 5 * 60 * 1000,
        })
        
        queryClient.prefetchQuery({
          queryKey: ["users", "all"],
          queryFn: () => usuariosService.getAll(),
          staleTime: 3 * 60 * 1000,
        })
      }
      
      // Precargar recursos (son públicos pero usados frecuentemente)
      queryClient.prefetchQuery({
        queryKey: ["recursos", "all"],
        queryFn: () => recursosService.getAll(),
        staleTime: 10 * 60 * 1000,
      })
    }
  }, [user, isAuthenticated, queryClient])
  
  // Configurar refetch automático para estadísticas
  useEffect(() => {
    if (user && isAuthenticated) {
      // Refetch estadísticas cada 5 minutos
      const interval = setInterval(() => {
        if (user.rol === "ADMIN") {
          queryClient.invalidateQueries({ queryKey: ["estadisticas", "generales"] })
        } else if (user.rol === "PROFESOR") {
          queryClient.invalidateQueries({ queryKey: ["estadisticas", "profesor", user.id] })
        } else if (user.rol === "ESTUDIANTE") {
          queryClient.invalidateQueries({ queryKey: ["estadisticas", "estudiante", user.id] })
        }
      }, 5 * 60 * 1000) // 5 minutos
      
      return () => clearInterval(interval)
    }
  }, [user, isAuthenticated, queryClient])
  
  return <>{children}</>
}

// Función helper para invalidar cache específico por rol
export function invalidateUserCache(queryClient: any, user: any) {
  if (!user) return

  switch (user.rol) {
    case "ADMIN":
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      queryClient.invalidateQueries({ queryKey: ["recursos"] })
      queryClient.invalidateQueries({ queryKey: ["estadisticas", "generales"] })
      break
    case "PROFESOR":
      queryClient.invalidateQueries({ queryKey: ["courses", "profesor", user.id] })
      queryClient.invalidateQueries({ queryKey: ["estadisticas", "profesor", user.id] })
      break
    case "ESTUDIANTE":
      queryClient.invalidateQueries({ queryKey: ["inscripciones", "estudiante", user.id] })
      queryClient.invalidateQueries({ queryKey: ["estadisticas", "estudiante", user.id] })
      break
  }
}
