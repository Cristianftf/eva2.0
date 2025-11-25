"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/context/auth.context"
import { coursesService } from "@/lib/services/courses.service"
import type { Curso } from "@/lib/types"
import { Search, BookOpen, Clock, Users } from "lucide-react"

export function CursosDisponiblesTab() {
  const { user } = useAuth()
  const router = useRouter()
  const [cursos, setCursos] = useState<Curso[]>([])
  const [filteredCursos, setFilteredCursos] = useState<Curso[]>([])
  const [solicitudes, setSolicitudes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [inscribiendo, setInscribiendo] = useState<string | null>(null)

  useEffect(() => {
    loadCursos()
  }, [])

  useEffect(() => {
    filterCursos()
  }, [searchTerm, cursos])

  const loadCursos = async () => {
    setLoading(true)
    setError(null)

    try {
      const cursosResult = await coursesService.getAllCourses()

      if (cursosResult.success && cursosResult.data) {
        setCursos(cursosResult.data.filter((c) => c.activo))
      } else {
        setError(cursosResult.error || "Error al cargar cursos")
      }

      // Cargar solicitudes del estudiante si está logueado
      if (user) {
        const solicitudesResult = await coursesService.getInscripcionesByEstudiante(user.id)
        if (solicitudesResult.success && solicitudesResult.data) {
          setSolicitudes(solicitudesResult.data)
        }
      }
    } catch (err) {
      setError("Error al cargar datos")
    }

    setLoading(false)
  }

  const filterCursos = () => {
    let filtered = cursos

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredCursos(filtered)
  }

  const handleSolicitarInscripcion = async (cursoId: string) => {
    if (!user) return

    setInscribiendo(cursoId)

    const result = await coursesService.solicitarInscripcion(cursoId, user.id)

    if (result.success) {
      alert("Solicitud de inscripción enviada. Espera la aprobación del profesor.")
      // Recargar cursos para actualizar estado
      loadCursos()
    } else {
      alert(result.error || "Error al enviar solicitud de inscripción")
    }

    setInscribiendo(null)
  }

  const getEstadoSolicitud = (cursoId: string) => {
    const solicitud = solicitudes.find(s => s.cursoId === cursoId)
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
          <AlertDescription>{error}</AlertDescription>
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
                    {getButtonText(estadoSolicitud, inscribiendo === curso.id, estadoSolicitud === 'APROBADA' ? (solicitudes.find(s => s.cursoId === parseInt(curso.id))?.progreso || 0) : 0)}
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
