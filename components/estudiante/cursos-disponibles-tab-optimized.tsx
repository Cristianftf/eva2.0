// Versión optimizada con React Query para cache
"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/context/auth.context"
import { useCachedCourses, useCachedInscripcionesByEstudiante } from "@/hooks/use-cached-data"
import type { Curso } from "@/lib/types"
import { Search, BookOpen, Clock, Users } from "lucide-react"

export function CursosDisponiblesTab() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [inscribiendo, setInscribiendo] = useState<string | null>(null)

  // Usar cache para cursos y inscripciones
  const { data: cursosResponse, isLoading: loading, error } = useCachedCourses()
  const { data: inscripcionesResponse } = useCachedInscripcionesByEstudiante(user?.id || "")
  
  // Memoizar cursos filtrados
  const cursos = useMemo(() => 
    cursosResponse?.data?.filter((c) => c.activo) || [], 
    [cursosResponse?.data]
  )

  // Memoizar inscripciones
  const inscripciones = useMemo(() => 
    inscripcionesResponse?.data || [], 
    [inscripcionesResponse?.data]
  )

  // Filtrado optimizado en cliente
  const filteredCursos = useMemo(() => {
    if (!searchTerm) return cursos
    
    return cursos.filter(
      (c) =>
        c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [cursos, searchTerm])

  const handleSolicitarInscripcion = async (cursoId: string) => {
    if (!user) return

    setInscribiendo(cursoId)

    try {
      // Aquí iría la lógica de solicitar inscripción
      // Por ahora mantenemos la lógica existente
      alert("Solicitud de inscripción enviada. Espera la aprobación del profesor.")
      
      // En el futuro, usaríamos:
      // const result = await inscripcionesService.solicitar(cursoId, user.id)
    } catch (error) {
      alert("Error al enviar solicitud de inscripción")
    } finally {
      setInscribiendo(null)
    }
  }

  const getEstadoSolicitud = (cursoId: string) => {
    const solicitud = inscripciones.find(s => s.cursoId === parseInt(cursoId))
    return solicitud?.estado || null
  }

  const getBadgeVariant = (estado: string | null) => {
    switch (estado) {
      case 'PENDIENTE': return 'secondary'
      case 'APROBADA': return 'default'
      case 'RECHAZADA': return 'destructive'
      default: return 'outline'
    }
  }

  const getBadgeText = (estado: string | null) => {
    switch (estado) {
      case 'PENDIENTE': return 'Solicitud Pendiente'
      case 'APROBADA': return 'Inscrito'
      case 'RECHAZADA': return 'Solicitud Rechazada'
      default: return 'Disponible'
    }
  }

  const getButtonText = (estado: string | null, inscribiendo: boolean, progreso: number = 0) => {
    if (inscribiendo) return 'Enviando...'
    switch (estado) {
      case 'PENDIENTE': return 'Solicitud Enviada'
      case 'APROBADA': return progreso > 0 ? 'Continuar Curso' : 'Empezar Curso'
      case 'RECHAZADA': return 'Solicitar de Nuevo'
      default: return 'Solicitar Inscripción'
    }
  }

  const canSolicitar = (estado: string | null) => {
    return !estado || estado === 'RECHAZADA'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar cursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message || "Error al cargar cursos"}</AlertDescription>
        </Alert>
      )}

      {/* Courses Grid */}
      {filteredCursos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No se encontraron cursos</h3>
            <p className="text-muted-foreground">Intenta con otros términos de búsqueda</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCursos.map((curso) => {
            const estadoSolicitud = getEstadoSolicitud(curso.id)
            return (
              <Card key={curso.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <BookOpen className="h-6 w-6 text-primary flex-shrink-0" />
                    <Badge variant={getBadgeVariant(estadoSolicitud)}>
                      {getBadgeText(estadoSolicitud)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{curso.titulo}</CardTitle>
                  <CardDescription className="line-clamp-3">{curso.descripcion}</CardDescription>
                  {curso.objetivos && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      <strong>Objetivos:</strong> {curso.objetivos}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{curso.duracionEstimada || 0}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{curso.nivel || 'Principiante'}</span>
                    </div>
                    {curso.categoria && (
                      <Badge variant="outline" className="text-xs">
                        {curso.categoria}
                      </Badge>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => estadoSolicitud === 'APROBADA' ? router.push(`/estudiante/curso/${curso.id}`) : handleSolicitarInscripcion(curso.id)}
                    disabled={inscribiendo === curso.id || !canSolicitar(estadoSolicitud)}
                  >
                    {getButtonText(estadoSolicitud, inscribiendo === curso.id, estadoSolicitud === 'APROBADA' ? (inscripciones.find(s => s.cursoId === parseInt(curso.id))?.progreso || 0) : 0)}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}