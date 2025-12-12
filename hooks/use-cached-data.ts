// Hooks de cache para datos usando React Query
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { coursesService } from "@/lib/services/courses.service"
import { usuariosService } from "@/lib/services/usuarios.service"
import { recursosService } from "@/lib/services/recursos.service"
import { estadisticasService } from "@/lib/services/estadisticas.service"
import { cuestionariosService } from "@/lib/services/cuestionarios.service"
import { inscripcionesService } from "@/lib/services/inscripciones.service"
import { authService } from "@/lib/services/auth.service"
import { useAuth } from "@/lib/context/auth.context"

// ============================================
// HOOKS PARA CURSOS
// ============================================

export function useCachedCourses(page = 1, pageSize = 1000) {
  return useQuery({
    queryKey: ["courses", "all", page, pageSize],
    queryFn: () => coursesService.getAllCourses(page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

export function useCachedCourse(id: string) {
  return useQuery({
    queryKey: ["courses", "single", id],
    queryFn: () => coursesService.getCourseById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}

export function useCachedUserCourses(userId: string) {
  return useQuery({
    queryKey: ["courses", "profesor", userId],
    queryFn: () => coursesService.getCoursesByProfesor(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

export function useCachedCourseTopics(courseId: string) {
  return useQuery({
    queryKey: ["courses", courseId, "topics"],
    queryFn: () => coursesService.getCourseTopics(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  })
}

// ============================================
// HOOKS PARA USUARIOS
// ============================================

export function useCachedUsers() {
  return useQuery({
    queryKey: ["users", "all"],
    queryFn: () => usuariosService.getAll(),
    staleTime: 3 * 60 * 1000, // 3 minutos
  })
}

export function useCachedUser(id: string) {
  return useQuery({
    queryKey: ["users", "single", id],
    queryFn: () => usuariosService.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}

// Cache para datos del usuario actual
export function useCurrentUser() {
  const { user, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ["user", "current"],
    queryFn: () => authService.getCurrentUser(),
    enabled: !!user && isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}

// ============================================
// HOOKS PARA RECURSOS
// ============================================

export function useCachedRecursos() {
  return useQuery({
    queryKey: ["recursos", "all"],
    queryFn: () => recursosService.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutos - recursos cambian poco
  })
}

export function useCachedRecursosByCategoria(categoria: string) {
  return useQuery({
    queryKey: ["recursos", "categoria", categoria],
    queryFn: () => recursosService.getByCategoria(categoria),
    enabled: !!categoria,
    staleTime: 10 * 60 * 1000,
  })
}

// ============================================
// HOOKS PARA ESTADÍSTICAS
// ============================================

export function useCachedEstadisticasGenerales() {
  return useQuery({
    queryKey: ["estadisticas", "generales"],
    queryFn: () => estadisticasService.getGenerales(),
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: 5 * 60 * 1000, // Refetch automático cada 5 minutos
  })
}

export function useCachedEstadisticasProfesor(profesorId: string) {
  return useQuery({
    queryKey: ["estadisticas", "profesor", profesorId],
    queryFn: () => estadisticasService.getProfesor(profesorId),
    enabled: !!profesorId,
    staleTime: 3 * 60 * 1000, // 3 minutos
  })
}

export function useCachedEstadisticasEstudiante(estudianteId: string) {
  return useQuery({
    queryKey: ["estadisticas", "estudiante", estudianteId],
    queryFn: () => estadisticasService.getEstudiante(estudianteId),
    enabled: !!estudianteId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

// ============================================
// HOOKS PARA CUESTIONARIOS
// ============================================

export function useCachedCuestionariosByCurso(cursoId: string) {
  return useQuery({
    queryKey: ["cuestionarios", "curso", cursoId],
    queryFn: () => cuestionariosService.getByCurso(cursoId),
    enabled: !!cursoId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCachedCuestionario(id: number) {
  return useQuery({
    queryKey: ["cuestionarios", "single", id],
    queryFn: () => cuestionariosService.obtenerCuestionario(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}

// ============================================
// HOOKS PARA INSCRIPCIONES
// ============================================

export function useCachedInscripcionesByEstudiante(estudianteId: string) {
  return useQuery({
    queryKey: ["inscripciones", "estudiante", estudianteId],
    queryFn: () => inscripcionesService.getByEstudiante(estudianteId),
    enabled: !!estudianteId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

// ============================================
// MUTATIONS CON INVALIDACIÓN AUTOMÁTICA
// ============================================

// Mutations para cursos
export function useCreateCourse() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: coursesService.createCourse,
    onSuccess: (data) => {
      // Invalidar cache de cursos
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      queryClient.invalidateQueries({ queryKey: ["courses", "profesor"] })
      
      // Agregar al cache específico si tenemos el ID
      if (data?.data) {
        queryClient.setQueryData(
          ["courses", "single", data.data.id], 
          { success: true, data: data.data }
        )
      }
    },
    onError: (error) => {
      console.error("Error creating course:", error)
    },
  })
}

export function useUpdateCourse() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      coursesService.updateCourse(id, data),
    onSuccess: (response, variables) => {
      if (response?.data) {
        // Actualizar cache específico
        queryClient.setQueryData(
          ["courses", "single", variables.id], 
          { success: true, data: response.data }
        )
        // Invalidar listas
        queryClient.invalidateQueries({ queryKey: ["courses"] })
        queryClient.invalidateQueries({ queryKey: ["courses", "profesor"] })
      }
    },
    onError: (error) => {
      console.error("Error updating course:", error)
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: coursesService.deleteCourse,
    onSuccess: (_, courseId) => {
      // Remover del cache específico
      queryClient.removeQueries({ queryKey: ["courses", "single", courseId] })
      queryClient.removeQueries({ queryKey: ["courses", courseId] })
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      queryClient.invalidateQueries({ queryKey: ["courses", "profesor"] })
    },
    onError: (error) => {
      console.error("Error deleting course:", error)
    },
  })
}

// Mutations para usuarios
export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: usuariosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (error) => {
      console.error("Error creating user:", error)
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      usuariosService.update(id, data),
    onSuccess: (response, variables) => {
      if (response?.data) {
        // Actualizar cache específico
        queryClient.setQueryData(
          ["users", "single", variables.id], 
          { success: true, data: response.data }
        )
        // Invalidar listas
        queryClient.invalidateQueries({ queryKey: ["users"] })
        
        // Si es el usuario actual, invalidar su cache
        if (variables.id === "current") {
          queryClient.invalidateQueries({ queryKey: ["user", "current"] })
        }
      }
    },
    onError: (error) => {
      console.error("Error updating user:", error)
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: usuariosService.delete,
    onSuccess: (_, userId) => {
      // Remover del cache específico
      queryClient.removeQueries({ queryKey: ["users", "single", userId] })
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (error) => {
      console.error("Error deleting user:", error)
    },
  })
}
