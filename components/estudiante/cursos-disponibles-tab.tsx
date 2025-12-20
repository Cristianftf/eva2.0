"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useStudentData } from "@/hooks/use-student-data"
import { useConfirmationDialog } from "@/hooks/use-confirmation-dialog"
import { LoadingState, ErrorState, EmptyState, SkeletonGrid } from "@/components/ui/data-states"
import { Search, BookOpen, Clock, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function CursosDisponiblesTab() {
  const router = useRouter()
  const { cursosDisponibles, cursosInscritos, loading, error, solicitarInscripcion, refetchCursosDisponibles } = useStudentData()
  const { confirm } = useConfirmationDialog()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [inscribiendo, setInscribiendo] = useState<string | null>(null)

  // Filtrar cursos usando useMemo para optimización
  const filteredCursos = useMemo(() => {
    if (!cursosDisponibles) return []

    let filtered = cursosDisponibles

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return filtered
  }, [cursosDisponibles, searchTerm])

  const handleSolicitarInscripcion = async (cursoId: string) => {
    const confirmed = await confirm("¿Estás seguro de que quieres solicitar la inscripción a este curso?")
    if (!confirmed) return

    setInscribiendo(cursoId)

    try {
      const result = await solicitarInscripcion(cursoId)
      if (result.success) {
        toast({
          title: "Solicitud enviada",
          description: "Tu solicitud de inscripción ha sido enviada. Espera la aprobación del profesor.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al enviar la solicitud de inscripción",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error de conexión",
        description: "No se pudo enviar la solicitud. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }

    setInscribiendo(null)
  }

  const getEstadoSolicitud = (cursoId: string) => {
    const solicitud = cursosInscritos?.find(s => s.cursoId === cursoId)
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

  const getButtonText = (estado: string | null, inscribiendo: boolean) => {
    if (inscribiendo) return 'Enviando...'
    switch (estado) {
      case 'PENDIENTE': return 'Solicitud Enviada'
      case 'APROBADA': return 'Ir al Curso'
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
        <LoadingState message="Cargando cursos disponibles..." />
      </div>
    )
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetchCursosDisponibles} />
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

      {/* Courses Grid */}
      {filteredCursos.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No se encontraron cursos"
          description={searchTerm ? "Intenta con otros términos de búsqueda" : "No hay cursos disponibles en este momento"}
        />
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
                    {getButtonText(estadoSolicitud, inscribiendo === curso.id)}
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
