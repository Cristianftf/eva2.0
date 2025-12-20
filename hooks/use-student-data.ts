import { useCallback } from 'react'
import { useAuth } from '@/lib/context/auth.context'
import { coursesService } from '@/lib/services/courses.service'
import { cuestionariosService } from '@/lib/services/cuestionarios.service'
import { estadisticasService } from '@/lib/services/estadisticas.service'
import { useAsyncData } from './use-async-data'
import type { Curso, Inscripcion } from '@/lib/types'

/**
 * Hook personalizado para operaciones de datos del estudiante
 * Centraliza todas las llamadas a API relacionadas con estudiantes
 */
export function useStudentData() {
  const { user } = useAuth()

  // Cursos inscritos del estudiante
  const {
    data: cursosInscritos,
    loading: loadingCursosInscritos,
    error: errorCursosInscritos,
    refetch: refetchCursosInscritos
  } = useAsyncData(
    () => user ? coursesService.getInscripcionesByEstudiante(user.id) : Promise.resolve({ success: false, error: 'Usuario no disponible' }),
    { enabled: !!user }
  )

  // Cursos disponibles para inscripción
  const {
    data: cursosDisponibles,
    loading: loadingCursosDisponibles,
    error: errorCursosDisponibles,
    refetch: refetchCursosDisponibles
  } = useAsyncData(
    async () => {
      if (!user) return { success: false, error: 'Usuario no disponible' }

      try {
        // Obtener todos los cursos
        const allCoursesResult = await coursesService.getAllCourses()
        if (!allCoursesResult.success || !allCoursesResult.data) {
          return { success: false, error: 'No se pudieron cargar los cursos' }
        }

        // Obtener cursos inscritos para filtrar
        const enrolledResult = await coursesService.getInscripcionesByEstudiante(user.id)
        const enrolledCourseIds = enrolledResult.success && enrolledResult.data
          ? enrolledResult.data.map(i => i.cursoId)
          : []

        // Filtrar cursos no inscritos y activos
        const availableCourses = allCoursesResult.data.filter(curso =>
          curso.activo && !enrolledCourseIds.includes(curso.id)
        )

        return { success: true, data: availableCourses }
      } catch (error) {
        return { success: false, error: 'Error al cargar cursos disponibles' }
      }
    },
    { enabled: !!user }
  )

  // Estadísticas del estudiante
  const {
    data: estadisticas,
    loading: loadingEstadisticas,
    error: errorEstadisticas,
    refetch: refetchEstadisticas
  } = useAsyncData(
    () => user ? estadisticasService.getEstudiante(user.id) : Promise.resolve({ success: false, error: 'Usuario no disponible' }),
    { enabled: !!user }
  )

  // Resultados de cuestionarios
  const {
    data: resultadosCuestionarios,
    loading: loadingResultados,
    error: errorResultados,
    refetch: refetchResultados
  } = useAsyncData(
    () => user ? cuestionariosService.getResultadosByEstudiante(user.id) : Promise.resolve({ success: false, error: 'Usuario no disponible' }),
    { enabled: !!user }
  )

  // Funciones de acción
  const solicitarInscripcion = useCallback(async (cursoId: string) => {
    if (!user) return { success: false, error: 'Usuario no disponible' }

    const result = await coursesService.solicitarInscripcion(cursoId, user.id)
    if (result.success) {
      // Recargar listas después de la inscripción
      refetchCursosInscritos()
      refetchCursosDisponibles()
    }
    return result
  }, [user, refetchCursosInscritos, refetchCursosDisponibles])

  const cancelarInscripcion = useCallback(async (cursoId: string) => {
    const result = await coursesService.unenrollCourse(cursoId)
    if (result.success) {
      // Recargar listas después de cancelar
      refetchCursosInscritos()
      refetchCursosDisponibles()
    }
    return result
  }, [refetchCursosInscritos, refetchCursosDisponibles])

  return {
    // Datos
    cursosInscritos,
    cursosDisponibles,
    estadisticas,
    resultadosCuestionarios,

    // Estados de carga
    loading: loadingCursosInscritos || loadingCursosDisponibles || loadingEstadisticas || loadingResultados,
    loadingCursosInscritos,
    loadingCursosDisponibles,
    loadingEstadisticas,
    loadingResultados,

    // Errores
    error: errorCursosInscritos || errorCursosDisponibles || errorEstadisticas || errorResultados,

    // Acciones
    solicitarInscripcion,
    cancelarInscripcion,

    // Refetch functions
    refetchCursosInscritos,
    refetchCursosDisponibles,
    refetchEstadisticas,
    refetchResultados
  }
}