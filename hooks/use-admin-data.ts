import { useCallback } from 'react'
import { useAuth } from '@/lib/context/auth.context'
import { usuariosService } from '@/lib/services/usuarios.service'
import { coursesService } from '@/lib/services/courses.service'
import { estadisticasService } from '@/lib/services/estadisticas.service'
import { recursosService } from '@/lib/services/recursos.service'
import { useAsyncData } from './use-async-data'
import type { User, Curso, RecursoConfiable } from '@/lib/types'

/**
 * Hook personalizado para operaciones de datos del administrador
 * Centraliza todas las llamadas a API relacionadas con administración
 */
export function useAdminData() {
  const { user } = useAuth()

  // Usuarios del sistema
  const {
    data: usuarios,
    loading: loadingUsuarios,
    error: errorUsuarios,
    refetch: refetchUsuarios
  } = useAsyncData(
    () => user ? usuariosService.getAll() : Promise.resolve({ success: false, error: 'Usuario no disponible' }),
    { enabled: !!user }
  )

  // Todos los cursos del sistema
  const {
    data: cursos,
    loading: loadingCursos,
    error: errorCursos,
    refetch: refetchCursos
  } = useAsyncData(
    () => user ? coursesService.getAllCourses() : Promise.resolve({ success: false, error: 'Usuario no disponible' }),
    { enabled: !!user }
  )

  // Estadísticas globales del sistema
  const {
    data: estadisticasGlobales,
    loading: loadingEstadisticas,
    error: errorEstadisticas,
    refetch: refetchEstadisticas
  } = useAsyncData(
    () => user ? estadisticasService.getGenerales() : Promise.resolve({ success: false, error: 'Usuario no disponible' }),
    { enabled: !!user }
  )

  // Recursos confiables
  const {
    data: recursos,
    loading: loadingRecursos,
    error: errorRecursos,
    refetch: refetchRecursos
  } = useAsyncData(
    () => user ? recursosService.getAll() : Promise.resolve({ success: false, error: 'Usuario no disponible' }),
    { enabled: !!user }
  )

  // Funciones de acción para usuarios
  const crearUsuario = useCallback(async (userData: Omit<User, 'id' | 'fechaRegistro'>) => {
    const result = await usuariosService.create(userData)
    if (result.success) {
      refetchUsuarios() // Recargar lista de usuarios
    }
    return result
  }, [refetchUsuarios])

  const actualizarUsuario = useCallback(async (id: string, userData: Partial<User>) => {
    const result = await usuariosService.update(id, userData)
    if (result.success) {
      refetchUsuarios() // Recargar lista de usuarios
    }
    return result
  }, [refetchUsuarios])

  const eliminarUsuario = useCallback(async (id: string) => {
    const result = await usuariosService.delete(id)
    if (result.success) {
      refetchUsuarios() // Recargar lista de usuarios
    }
    return result
  }, [refetchUsuarios])

  // Funciones de acción para cursos
  const crearCurso = useCallback(async (cursoData: Omit<Curso, 'id'>) => {
    const result = await coursesService.createCourse(cursoData)
    if (result.success) {
      refetchCursos() // Recargar lista de cursos
    }
    return result
  }, [refetchCursos])

  const actualizarCurso = useCallback(async (id: string, cursoData: Partial<Curso>) => {
    const result = await coursesService.updateCourse(id, cursoData)
    if (result.success) {
      refetchCursos() // Recargar lista de cursos
    }
    return result
  }, [refetchCursos])

  const eliminarCurso = useCallback(async (id: string) => {
    const result = await coursesService.deleteCourse(id)
    if (result.success) {
      refetchCursos() // Recargar lista de cursos
    }
    return result
  }, [refetchCursos])

  // Funciones de acción para recursos
  const crearRecurso = useCallback(async (recursoData: Omit<RecursoConfiable, 'id' | 'fechaCreacion'>) => {
    const result = await recursosService.create(recursoData)
    if (result.success) {
      refetchRecursos() // Recargar lista de recursos
    }
    return result
  }, [refetchRecursos])

  const actualizarRecurso = useCallback(async (id: string, recursoData: Partial<RecursoConfiable>) => {
    const result = await recursosService.update(id, recursoData)
    if (result.success) {
      refetchRecursos() // Recargar lista de recursos
    }
    return result
  }, [refetchRecursos])

  const eliminarRecurso = useCallback(async (id: string) => {
    const result = await recursosService.delete(id)
    if (result.success) {
      refetchRecursos() // Recargar lista de recursos
    }
    return result
  }, [refetchRecursos])

  return {
    // Datos
    usuarios,
    cursos,
    estadisticasGlobales,
    recursos,

    // Estados de carga
    loading: loadingUsuarios || loadingCursos || loadingEstadisticas || loadingRecursos,
    loadingUsuarios,
    loadingCursos,
    loadingEstadisticas,
    loadingRecursos,

    // Errores
    error: errorUsuarios || errorCursos || errorEstadisticas || errorRecursos,

    // Acciones de usuarios
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,

    // Acciones de cursos
    crearCurso,
    actualizarCurso,
    eliminarCurso,

    // Acciones de recursos
    crearRecurso,
    actualizarRecurso,
    eliminarRecurso,

    // Refetch functions
    refetchUsuarios,
    refetchCursos,
    refetchEstadisticas,
    refetchRecursos
  }
}