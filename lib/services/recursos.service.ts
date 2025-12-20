import { apiService } from "./api.service"
import { API_ENDPOINTS } from "@/lib/config/api.config"
import type { RecursoConfiable, ApiResponse } from "@/lib/types"

// Biblioteca local de información de salud como fallback
const LOCAL_HEALTH_RESOURCES: RecursoConfiable[] = [
  {
    id: "local-1",
    titulo: "Guía Básica de Primeros Auxilios",
    descripcion: "Información esencial para manejar emergencias médicas comunes",
    contenido: "Aprende a manejar situaciones de emergencia como RCP, control de hemorragias y atención inicial de heridas.",
    categoria: "Primeros Auxilios",
    especialidad: "Medicina General",
    urgencia: "alta",
    tipo: "prevencion",
    fuente: "Biblioteca Local HealthConnect",
    url: "#",
    fechaCreacion: new Date("2024-01-01"),
    verificado: true,
    tags: ["emergencias", "primeros auxilios", "seguridad"]
  },
  {
    id: "local-2",
    titulo: "Alimentación Saludable para Adultos",
    descripcion: "Guías nutricionales para mantener una dieta balanceada",
    contenido: "Descubre los principios de una alimentación saludable, incluyendo macronutrientes, micronutrientes y hábitos alimenticios.",
    categoria: "Nutrición",
    especialidad: "Nutrición",
    urgencia: "baja",
    tipo: "prevencion",
    fuente: "Biblioteca Local HealthConnect",
    url: "#",
    fechaCreacion: new Date("2024-01-01"),
    verificado: true,
    tags: ["nutricion", "alimentacion", "prevencion"]
  },
  {
    id: "local-3",
    titulo: "Ejercicio Físico y Salud Cardiovascular",
    descripcion: "Beneficios del ejercicio para la salud del corazón",
    contenido: "El ejercicio regular reduce el riesgo de enfermedades cardiovasculares, mejora la circulación y fortalece el corazón.",
    categoria: "Cardiología",
    especialidad: "Cardiología",
    urgencia: "media",
    tipo: "prevencion",
    fuente: "Biblioteca Local HealthConnect",
    url: "#",
    fechaCreacion: new Date("2024-01-01"),
    verificado: true,
    tags: ["ejercicio", "corazon", "prevencion", "cardiovascular"]
  },
  {
    id: "local-4",
    titulo: "Manejo del Estrés y Salud Mental",
    descripcion: "Estrategias para manejar el estrés diario",
    contenido: "Técnicas de relajación, mindfulness y manejo del estrés para mantener la salud mental.",
    categoria: "Salud Mental",
    especialidad: "Psiquiatría",
    urgencia: "media",
    tipo: "tratamiento",
    fuente: "Biblioteca Local HealthConnect",
    url: "#",
    fechaCreacion: new Date("2024-01-01"),
    verificado: true,
    tags: ["estres", "salud mental", "mindfulness", "bienestar"]
  },
  {
    id: "local-5",
    titulo: "Vacunas y Prevención de Enfermedades",
    descripcion: "Calendario de vacunación recomendado",
    contenido: "Información sobre vacunas esenciales para diferentes etapas de la vida y prevención de enfermedades infecciosas.",
    categoria: "Inmunología",
    especialidad: "Medicina Preventiva",
    urgencia: "media",
    tipo: "prevencion",
    fuente: "Biblioteca Local HealthConnect",
    url: "#",
    fechaCreacion: new Date("2024-01-01"),
    verificado: true,
    tags: ["vacunas", "prevencion", "inmunologia", "enfermedades"]
  }
]

class RecursosService {
  // Obtener todos los recursos
  async getAll(): Promise<ApiResponse<RecursoConfiable[]>> {
    return apiService.get<RecursoConfiable[]>(API_ENDPOINTS.resources.base)
  }

  // Obtener recurso por ID
  async getById(id: string): Promise<ApiResponse<RecursoConfiable>> {
    return apiService.get<RecursoConfiable>(API_ENDPOINTS.resources.byId(id))
  }

  // Obtener recursos por categoría
  async getByCategoria(categoria: string): Promise<ApiResponse<RecursoConfiable[]>> {
    return apiService.get<RecursoConfiable[]>(API_ENDPOINTS.resources.byCategoria(categoria))
  }

  // Crear nuevo recurso (solo admin)
  async create(data: Omit<RecursoConfiable, "id" | "fechaCreacion">): Promise<ApiResponse<RecursoConfiable>> {
    return apiService.post<RecursoConfiable>(API_ENDPOINTS.resources.base, data)
  }

  // Actualizar recurso (solo admin)
  async update(id: string, data: Partial<RecursoConfiable>): Promise<ApiResponse<RecursoConfiable>> {
    return apiService.put<RecursoConfiable>(API_ENDPOINTS.resources.byId(id), data)
  }

  // Eliminar recurso (solo admin)
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(API_ENDPOINTS.resources.byId(id))
  }

  // Búsqueda avanzada para temas de salud
  async searchByHealthTopic(query: string, filters?: {
    categoria?: string
    especialidad?: string
    urgencia?: 'baja' | 'media' | 'alta'
    tipo?: 'prevencion' | 'diagnostico' | 'tratamiento' | 'seguimiento'
  }): Promise<ApiResponse<RecursoConfiable[]>> {
    const params = new URLSearchParams({ q: query })
    if (filters?.categoria) params.append('categoria', filters.categoria)
    if (filters?.especialidad) params.append('especialidad', filters.especialidad)
    if (filters?.urgencia) params.append('urgencia', filters.urgencia)
    if (filters?.tipo) params.append('tipo', filters.tipo)

    return apiService.get<RecursoConfiable[]>(`${API_ENDPOINTS.resources.base}/busqueda?${params}`)
  }

  // Obtener recursos por especialidad médica
  async getByEspecialidad(especialidad: string): Promise<ApiResponse<RecursoConfiable[]>> {
    return apiService.get<RecursoConfiable[]>(`${API_ENDPOINTS.resources.base}/especialidad/${especialidad}`)
  }

  // Obtener recursos de emergencia
  async getEmergencias(): Promise<ApiResponse<RecursoConfiable[]>> {
    return apiService.get<RecursoConfiable[]>(`${API_ENDPOINTS.resources.base}/emergencias`)
  }

  // Obtener recursos por síntomas
  async getBySintomas(sintomas: string[]): Promise<ApiResponse<RecursoConfiable[]>> {
    const params = new URLSearchParams()
    sintomas.forEach(sintoma => params.append('sintomas', sintoma))
    return apiService.get<RecursoConfiable[]>(`${API_ENDPOINTS.resources.base}/sintomas?${params}`)
  }

  // ============================================
  // INTEGRACIÓN CON APIs EXTERNAS DE SALUD
  // ============================================

  /**
   * Buscar información de salud desde múltiples fuentes confiables
   * Incluye fallback local si las APIs externas no están disponibles
   */
  async searchHealthInfo(query: string, options?: {
    sources?: ('pubmed' | 'who' | 'cdc' | 'local')[]
    limit?: number
  }): Promise<ApiResponse<RecursoConfiable[]>> {
    const { sources = ['pubmed', 'who', 'cdc', 'local'], limit = 10 } = options || {}

    try {
      const results: RecursoConfiable[] = []

      // Intentar APIs externas en paralelo
      const apiPromises = sources.map(async (source) => {
        if (source === 'local') return LOCAL_HEALTH_RESOURCES

        try {
          switch (source) {
            case 'pubmed':
              return await this.searchPubMed(query, limit)
            case 'who':
              return await this.searchWHO(query, limit)
            case 'cdc':
              return await this.searchCDC(query, limit)
            default:
              return []
          }
        } catch (error) {
          console.warn(`Error fetching from ${source}:`, error)
          return []
        }
      })

      const apiResults = await Promise.allSettled(apiPromises)

      // Recopilar resultados exitosos
      apiResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          results.push(...result.value)
        }
      })

      // Si no hay resultados de APIs externas, usar biblioteca local
      if (results.length === 0 && sources.includes('local')) {
        const localResults = LOCAL_HEALTH_RESOURCES.filter(resource =>
          resource.titulo.toLowerCase().includes(query.toLowerCase()) ||
          resource.descripcion.toLowerCase().includes(query.toLowerCase()) ||
          resource.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
        results.push(...localResults)
      }

      return {
        success: true,
        data: results.slice(0, limit)
      }

    } catch (error) {
      console.error('Error in health search:', error)
      // Fallback completo a biblioteca local
      const localResults = LOCAL_HEALTH_RESOURCES.filter(resource =>
        resource.titulo.toLowerCase().includes(query.toLowerCase()) ||
        resource.descripcion.toLowerCase().includes(query.toLowerCase()) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )

      return {
        success: true,
        data: localResults.slice(0, limit)
      }
    }
  }

  // Búsqueda en PubMed (NIH)
  private async searchPubMed(query: string, limit: number): Promise<RecursoConfiable[]> {
    try {
      // PubMed API (simplified - en producción necesitarías API key)
      const response = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${limit}&retmode=json`
      )

      if (!response.ok) throw new Error('PubMed API error')

      const data = await response.json()
      const ids = data.esearchresult.idlist || []

      // Obtener detalles de los artículos
      if (ids.length > 0) {
        const summaryResponse = await fetch(
          `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`
        )

        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json()
          return ids.map((id: string) => ({
            id: `pubmed-${id}`,
            titulo: summaryData.result[id]?.title || 'Artículo científico',
            descripcion: summaryData.result[id]?.source || 'Información médica',
            url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
            categoria: 'Investigación Médica',
            especialidad: 'Medicina General',
            fuente: 'PubMed (NIH)',
            fechaCreacion: new Date(),
            verificado: true,
            tags: ['investigacion', 'ciencia', 'medicina']
          }))
        }
      }

      return []
    } catch (error) {
      console.warn('PubMed search failed:', error)
      return []
    }
  }

  // Búsqueda en WHO (Organización Mundial de la Salud)
  private async searchWHO(query: string, limit: number): Promise<RecursoConfiable[]> {
    try {
      // WHO API (simplified)
      const response = await fetch(
        `https://www.who.int/api/hub/search?query=${encodeURIComponent(query)}&limit=${limit}`
      )

      if (!response.ok) throw new Error('WHO API error')

      const data = await response.json()
      return (data.results || []).map((item: any) => ({
        id: `who-${item.id || Math.random()}`,
        titulo: item.title || 'Información de la OMS',
        descripcion: item.description || item.excerpt || 'Recursos de salud global',
        url: item.url || '#',
        categoria: 'Salud Pública',
        especialidad: 'Medicina Preventiva',
        fuente: 'Organización Mundial de la Salud (OMS)',
        fechaCreacion: new Date(),
        verificado: true,
        tags: ['oms', 'salud publica', 'prevencion']
      }))
    } catch (error) {
      console.warn('WHO search failed:', error)
      return []
    }
  }

  // Búsqueda en CDC (Centros para el Control de Enfermedades)
  private async searchCDC(query: string, limit: number): Promise<RecursoConfiable[]> {
    try {
      // CDC API (simplified - búsqueda web)
      const response = await fetch(
        `https://search.cdc.gov/search/?query=${encodeURIComponent(query)}&utf8=✓&affiliate=cdc&limit=${limit}`
      )

      if (!response.ok) throw new Error('CDC API error')

      // Parsear resultados de búsqueda (esto es simplificado)
      const html = await response.text()
      // En producción, usar un parser HTML o API específica del CDC

      return [{
        id: `cdc-${Date.now()}`,
        titulo: `Información sobre ${query}`,
        descripcion: 'Recursos del Centro para el Control de Enfermedades',
        url: `https://www.cdc.gov/search/?query=${encodeURIComponent(query)}`,
        categoria: 'Salud Pública',
        especialidad: 'Epidemiología',
        fuente: 'Centros para el Control de Enfermedades (CDC)',
        fechaCreacion: new Date(),
        verificado: true,
        tags: ['cdc', 'salud publica', 'prevencion', 'eeuu']
      }]
    } catch (error) {
      console.warn('CDC search failed:', error)
      return []
    }
  }

  // Obtener recursos de emergencia locales
  getEmergencyResources(): RecursoConfiable[] {
    return LOCAL_HEALTH_RESOURCES.filter(resource =>
      resource.urgencia === 'alta' || resource.tags?.includes('emergencias')
    )
  }

  // Obtener biblioteca local completa
  getLocalLibrary(): RecursoConfiable[] {
    return LOCAL_HEALTH_RESOURCES
  }
}

export const recursosService = new RecursosService()
