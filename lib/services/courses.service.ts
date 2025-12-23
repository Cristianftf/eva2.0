// Servicio para gestión de cursos

import { apiService } from "./api.service"
import { API_ENDPOINTS } from "@/lib/config/api.config"
import type { Curso, Tema, Inscripcion, ApiResponse, PaginatedResponse } from "@/lib/types"

class CoursesService {
  async getAllCourses(page = 1, pageSize = 1000): Promise<ApiResponse<Curso[]>> {
    const result = await apiService.get<PaginatedResponse<Curso>>(`${API_ENDPOINTS.courses.base}?page=${page}&pageSize=${pageSize}`)
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.data
      }
    }
    return result as any
  }

  async getCourseById(id: string): Promise<ApiResponse<Curso>> {
    return apiService.get<Curso>(API_ENDPOINTS.courses.byId(id))
  }

  async getCoursesByProfesor(profesorId: string): Promise<ApiResponse<Curso[]>> {
    return apiService.get<Curso[]>(API_ENDPOINTS.courses.byProfesor(profesorId))
  }

  async createCourse(curso: Partial<Curso>): Promise<ApiResponse<Curso>> {
    return apiService.post<Curso>(API_ENDPOINTS.courses.base, curso)
  }

  async updateCourse(id: string, curso: Partial<Curso>): Promise<ApiResponse<Curso>> {
    return apiService.put<Curso>(API_ENDPOINTS.courses.byId(id), curso)
  }

  async deleteCourse(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(API_ENDPOINTS.courses.byId(id))
  }

  async solicitarInscripcion(cursoId: string, estudianteId: string): Promise<ApiResponse<Inscripcion>> {
    return apiService.post<Inscripcion>(API_ENDPOINTS.courses.solicitarInscripcion(cursoId), { estudianteId })
  }

  async aprobarInscripcion(inscripcionId: string): Promise<ApiResponse<Inscripcion>> {
    return apiService.post<Inscripcion>(API_ENDPOINTS.courses.aprobarInscripcion(inscripcionId))
  }

  async rechazarInscripcion(inscripcionId: string): Promise<ApiResponse<Inscripcion>> {
    return apiService.post<Inscripcion>(API_ENDPOINTS.courses.rechazarInscripcion(inscripcionId))
  }

  async getSolicitudesPendientes(profesorId: string): Promise<ApiResponse<Inscripcion[]>> {
    return apiService.get<Inscripcion[]>(API_ENDPOINTS.courses.base + `/solicitudes-pendientes?profesorId=${profesorId}`)
  }

  async getInscripcionesByEstudiante(estudianteId: string): Promise<ApiResponse<Inscripcion[]>> {
    return apiService.get<Inscripcion[]>(API_ENDPOINTS.courses.inscripcionesByEstudiante(estudianteId))
  }

  async getCursosDisponiblesByEstudiante(estudianteId: string): Promise<ApiResponse<Curso[]>> {
    return apiService.get<Curso[]>(API_ENDPOINTS.courses.disponiblesByEstudiante(estudianteId))
  }

  async unenrollCourse(cursoId: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(API_ENDPOINTS.courses.desinscribir(cursoId))
  }

  async getCourseTopics(cursoId: string): Promise<ApiResponse<Tema[]>> {
    return apiService.get<Tema[]>(API_ENDPOINTS.topics.byCurso(cursoId))
  }

  async createTopic(tema: Partial<Tema>): Promise<ApiResponse<Tema>> {
    return apiService.post<Tema>(API_ENDPOINTS.topics.base, tema)
  }

  async updateTopic(id: string, tema: Partial<Tema>): Promise<ApiResponse<Tema>> {
    return apiService.put<Tema>(API_ENDPOINTS.topics.byId(id), tema)
  }

  async deleteTopic(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(API_ENDPOINTS.topics.byId(id))
  }
}

export const coursesService = new CoursesService()
