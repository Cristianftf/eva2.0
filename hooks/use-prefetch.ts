// Hook para prefetch de páginas y datos frecuentes
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/lib/context/auth.context"

interface PrefetchConfig {
  enabled?: boolean
  staleTime?: number
}

// Prefetch de páginas basado en la navegación del usuario
export function usePrefetchPages() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  useEffect(() => {
    if (!user) return
    
    // Prefetch de rutas comunes después de un delay
    const prefetchTimer = setTimeout(() => {
      // Prefetch dashboard
      router.prefetch("/dashboard")
      
      // Prefetch rutas específicas por rol
      switch (user.rol) {
        case "ADMIN":
          router.prefetch("/admin/dashboard")
          router.prefetch("/recursos")
          break
        case "PROFESOR":
          router.prefetch("/profesor/dashboard")
          router.prefetch("/chat")
          break
        case "ESTUDIANTE":
          router.prefetch("/estudiante/dashboard")
          router.prefetch("/estudiante/cuestionario")
          router.prefetch("/recursos")
          break
      }
      
      // Prefetch páginas comunes
      router.prefetch("/perfil")
      router.prefetch("/configuracion")
      router.prefetch("/notificaciones")
      
      console.log("Prefetch completed for user role:", user.rol)
    }, 2000) // Delay de 2 segundos para no interferir con la carga inicial
    
    return () => clearTimeout(prefetchTimer)
  }, [user, router])
}

// Prefetch de datos basado en la ruta actual
export function usePrefetchOnRouteChange() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const path = url.split('?')[0] // Remover query params
      
      // Prefetch datos específicos según la ruta
      switch (path) {
        case "/dashboard":
          if (user?.rol === "PROFESOR") {
            queryClient.prefetchQuery({
              queryKey: ["courses", "profesor", user.id],
              queryFn: () => import("@/lib/services/courses.service").then(m => m.coursesService.getCoursesByProfesor(user.id)),
              staleTime: 2 * 60 * 1000,
            })
          } else if (user?.rol === "ESTUDIANTE") {
            queryClient.prefetchQuery({
              queryKey: ["inscripciones", "estudiante", user.id],
              queryFn: () => import("@/lib/services/inscripciones.service").then(m => m.inscripcionesService.getByEstudiante(user.id)),
              staleTime: 2 * 60 * 1000,
            })
          }
          break
          
        case "/admin/dashboard":
          queryClient.prefetchQuery({
            queryKey: ["users", "all"],
            queryFn: () => import("@/lib/services/usuarios.service").then(m => m.usuariosService.getAll()),
            staleTime: 3 * 60 * 1000,
          })
          queryClient.prefetchQuery({
            queryKey: ["courses", "all"],
            queryFn: () => import("@/lib/services/courses.service").then(m => m.coursesService.getAllCourses()),
            staleTime: 5 * 60 * 1000,
          })
          break
          
        case "/recursos":
          queryClient.prefetchQuery({
            queryKey: ["recursos", "all"],
            queryFn: () => import("@/lib/services/recursos.service").then(m => m.recursosService.getAll()),
            staleTime: 10 * 60 * 1000,
          })
          break
          
        case "/chat":
          // Prefetch datos necesarios para chat
          if (user) {
            queryClient.prefetchQuery({
              queryKey: ["mensajes", "recientes", user.id],
              queryFn: () => import("@/lib/services/mensajes.service").then(m => m.mensajesService.getRecientes(user.id)),
              staleTime: 1 * 60 * 1000,
            })
          }
          break
      }
    }
    
    // Configurar listener para cambios de ruta
    router.events?.on('routeChangeComplete', handleRouteChange)
    
    return () => {
      router.events?.off('routeChangeComplete', handleRouteChange)
    }
  }, [router, queryClient, user])
}

// Hook específico para prefetch de cursos
export function usePrefetchCourses(courseIds?: string[]) {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    if (!courseIds?.length) return
    
    courseIds.forEach(id => {
      queryClient.prefetchQuery({
        queryKey: ["courses", "single", id],
        queryFn: () => import("@/lib/services/courses.service").then(m => m.coursesService.getCourseById(id)),
        staleTime: 10 * 60 * 1000,
      })
    })
  }, [courseIds, queryClient])
}

// Hook específico para prefetch de cuestionarios
export function usePrefetchCuestionarios(cursoId?: string) {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    if (!cursoId) return
    
    queryClient.prefetchQuery({
      queryKey: ["cuestionarios", "curso", cursoId],
      queryFn: () => import("@/lib/services/cuestionarios.service").then(m => m.cuestionariosService.getByCurso(cursoId)),
      staleTime: 5 * 60 * 1000,
    })
  }, [cursoId, queryClient])
}

// Hook para prefetch inteligente basado en el comportamiento del usuario
export function useSmartPrefetch() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const router = useRouter()
  
  // Detectar patrones de navegación y hacer prefetch proactivo
  useEffect(() => {
    if (!user) return
    
    // Patrón común: después de ver dashboard, el usuario suele ir a sus cursos
    const timer = setTimeout(() => {
      // Escuchar eventos de navegación para detectar patrones
      const detectNavigationPattern = (url: string) => {
        const path = url.split('?')[0]
        
        // Si está en dashboard y es profesor, prefetch sus cursos
        if (path === "/dashboard" && user.rol === "PROFESOR") {
          setTimeout(() => {
            queryClient.prefetchQuery({
              queryKey: ["courses", "profesor", user.id],
              queryFn: () => import("@/lib/services/courses.service").then(m => m.coursesService.getCoursesByProfesor(user.id)),
              staleTime: 2 * 60 * 1000,
            })
          }, 1000)
        }
        
        // Si está en dashboard y es estudiante, prefetch sus inscripciones
        if (path === "/dashboard" && user.rol === "ESTUDIANTE") {
          setTimeout(() => {
            queryClient.prefetchQuery({
              queryKey: ["inscripciones", "estudiante", user.id],
              queryFn: () => import("@/lib/services/inscripciones.service").then(m => m.inscripcionesService.getByEstudiante(user.id)),
              staleTime: 2 * 60 * 1000,
            })
          }, 1000)
        }
        
        // Si está en recursos, precargar todas las categorías
        if (path === "/recursos") {
          setTimeout(() => {
            queryClient.prefetchQuery({
              queryKey: ["recursos", "all"],
              queryFn: () => import("@/lib/services/recursos.service").then(m => m.recursosService.getAll()),
              staleTime: 10 * 60 * 1000,
            })
          }, 1000)
        }
      }
      
      router.events?.on('routeChangeComplete', detectNavigationPattern)
      
      return () => {
        router.events?.off('routeChangeComplete', detectNavigationPattern)
      }
    }, 3000) // Esperar 3 segundos antes de empezar la detección
    
    return () => clearTimeout(timer)
  }, [user, queryClient, router])
}

// Hook para prefetch condicional basado en el estado del usuario
export function useConditionalPrefetch() {
  const queryClient = useQueryClient()
  const { user, isAuthenticated } = useAuth()
  
  // Solo prefetch si el usuario está autenticado
  useEffect(() => {
    if (!isAuthenticated || !user) return
    
    // Prefetch crítico inmediato
    const immediatePrefetch = async () => {
      try {
        // Datos del usuario actual
        await queryClient.prefetchQuery({
          queryKey: ["user", "current"],
          queryFn: () => import("@/lib/services/usuarios.service").then(m => m.usuariosService.getCurrentUser()),
          staleTime: 5 * 60 * 1000,
        })
        
        console.log("Critical data prefetched successfully")
      } catch (error) {
        console.error("Error prefetching critical data:", error)
      }
    }
    
    immediatePrefetch()
  }, [isAuthenticated, user, queryClient])
}