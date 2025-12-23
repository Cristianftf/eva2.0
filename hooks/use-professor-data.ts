import { useCallback } from 'react'
import { useAuth } from '@/lib/context/auth.context'
import { coursesService } from '@/lib/services/courses.service'
import { multimediaService } from '@/lib/services/multimedia.service'
import { useCachedUserCourses, useCachedEstadisticasProfesor } from './use-cached-data'
import { useQuery } from '@tanstack/react-query'
import type { Tema, MultimediaItem, Inscripcion } from '@/lib/types'

/**
 * Hook personalizado para operaciones de datos del profesor
 * Centraliza todas las llamadas a API relacionadas con profesores
 * Optimizado con React Query para cache y paralelización
 */
export function useProfessorData() {
  const { user } = useAuth()

  // Cursos del profesor - usando cache optimizado
  const {
    data: cursosData,
    isLoading: loadingCursos,
    error: errorCursos,
    refetch: refetchCursos
  } = useCachedUserCourses(user?.id || '')

  const cursos = cursosData?.success ? cursosData.data : null

  // Estadísticas del profesor - usando cache optimizado
  const {
    data: estadisticasData,
    isLoading: loadingEstadisticas,
    error: errorEstadisticas,
    refetch: refetchEstadisticas
  } = useCachedEstadisticasProfesor(user?.id || '')

  const estadisticas = estadisticasData?.success ? estadisticasData.data : null

  // Solicitudes de inscripción pendientes
  const {
    data: solicitudesData,
    isLoading: loadingSolicitudes,
    error: errorSolicitudes,
    refetch: refetchSolicitudes
  } = useQuery({
    queryKey: ['profesor', 'solicitudes', user?.id],
    queryFn: () => user ? coursesService.getSolicitudesPendientes(user.id) : Promise.resolve({ success: false, error: 'Usuario no disponible' }),
    enabled: !!user,
    staleTime: 60 * 1000, // 1 minuto
  })

  const solicitudesPendientes = solicitudesData?.success ? solicitudesData.data : null

  // Temas de todos los cursos del profesor - paralelizado
  const {
    data: temasData,
    isLoading: loadingTemas,
    error: errorTemas,
    refetch: refetchTemas
  } = useQuery({
    queryKey: ['profesor', 'temas', user?.id],
    queryFn: async () => {
      if (!user || !cursos) return { success: false, error: 'Usuario o cursos no disponibles' }

      try {
        // Paralelizar las llamadas a temas de todos los cursos
        const temasPromises = cursos.map(curso =>
          import('@/lib/services/temas.service').then(({ temasService }) =>
            temasService.getByCurso(curso.id.toString())
          )
        )

        const temasResults = await Promise.all(temasPromises)
        const allTemas: Tema[] = []

        temasResults.forEach(result => {
          if (result.success && result.data) {
            allTemas.push(...result.data)
          }
        })

        return { success: true, data: allTemas }
      } catch (error) {
        return { success: false, error: 'Error al cargar temas' }
      }
    },
    enabled: !!user && !!cursos,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  const temas = temasData?.success ? temasData.data : null

  // Multimedia del profesor - optimizado
  const {
    data: multimediaData,
    isLoading: loadingMultimedia,
    error: errorMultimedia,
    refetch: refetchMultimedia
  } = useQuery({
    queryKey: ['profesor', 'multimedia', user?.id],
    queryFn: async () => {
      if (!user) return { success: false, error: 'Usuario no disponible' }

      try {
        // Si es admin, obtener todo
        if (user.rol === 'ADMIN') {
          return await multimediaService.getAll()
        }

        // Para profesores, filtrar por sus cursos
        if (!cursos) return { success: false, error: 'Cursos no disponibles' }

        const cursoIds = cursos.map(c => c.id)
        const multimediaResult = await multimediaService.getAll()

        if (!multimediaResult.success || !multimediaResult.data) {
          return { success: false, error: 'No se pudo cargar multimedia' }
        }

        // Filtrar multimedia por cursos del profesor
        const filteredMultimedia = multimediaResult.data.filter(item =>
          item.temaId && cursoIds.includes(item.temaId)
        )

        return { success: true, data: filteredMultimedia }
      } catch (error) {
        return { success: false, error: 'Error al cargar multimedia' }
      }
    },
    enabled: !!user && (user.rol === 'ADMIN' || !!cursos),
    staleTime: 3 * 60 * 1000, // 3 minutos
  })

  const multimedia = multimediaData?.success ? multimediaData.data : null

  // Funciones de acción con invalidación de cache automática
  const eliminarCurso = useCallback(async (cursoId: string) => {
    const result = await coursesService.deleteCourse(cursoId)
    if (result.success) {
      // El cache se invalida automáticamente por las mutations en use-cached-data
      refetchCursos()
    }
    return result
  }, [refetchCursos])

  const aprobarSolicitud = useCallback(async (solicitudId: string) => {
    const result = await coursesService.aprobarInscripcion(solicitudId)
    if (result.success) {
      refetchSolicitudes()
    }
    return result
  }, [refetchSolicitudes])

  const rechazarSolicitud = useCallback(async (solicitudId: string) => {
    const result = await coursesService.rechazarInscripcion(solicitudId)
    if (result.success) {
      refetchSolicitudes()
    }
    return result
  }, [refetchSolicitudes])

  const eliminarMultimedia = useCallback(async (multimediaId: string) => {
    const result = await multimediaService.delete(multimediaId)
    if (result.success) {
      refetchMultimedia()
    }
    return result
  }, [refetchMultimedia])

  return {
    // Datos
    cursos,
    estadisticas,
    solicitudesPendientes,
    temas,
    multimedia,

    // Estados de carga
    loading: loadingCursos || loadingEstadisticas || loadingSolicitudes || loadingTemas || loadingMultimedia,
    loadingCursos,
    loadingEstadisticas,
    loadingSolicitudes,
    loadingTemas,
    loadingMultimedia,

    // Errores
    error: errorCursos?.message || errorEstadisticas?.message || errorSolicitudes?.message || errorTemas?.message || errorMultimedia?.message,

    // Acciones
    eliminarCurso,
    aprobarSolicitud,
    rechazarSolicitud,
    eliminarMultimedia,

    // Refetch functions
    refetchCursos,
    refetchEstadisticas,
    refetchSolicitudes,
    refetchTemas,
    refetchMultimedia
  }
}