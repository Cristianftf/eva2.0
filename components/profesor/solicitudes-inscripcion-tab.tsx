"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useProfessorData } from "@/hooks/use-professor-data"
import { useConfirmationDialog } from "@/hooks/use-confirmation-dialog"
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/data-states"
import { Check, X, Clock, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function SolicitudesInscripcionTab() {
  const { solicitudesPendientes, loading, error, aprobarSolicitud, rechazarSolicitud, refetchSolicitudes } = useProfessorData()
  const { confirm } = useConfirmationDialog()
  const { toast } = useToast()

  const handleAprobar = async (inscripcionId: string) => {
    try {
      const result = await aprobarSolicitud(inscripcionId)
      if (result.success) {
        toast({
          title: "Solicitud aprobada",
          description: "El estudiante ha sido inscrito en el curso.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al aprobar la solicitud",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error de conexión",
        description: "No se pudo aprobar la solicitud. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleRechazar = async (inscripcionId: string) => {
    const confirmed = await confirm("¿Estás seguro de rechazar esta solicitud? Esta acción no se puede deshacer.")
    if (!confirmed) return

    try {
      const result = await rechazarSolicitud(inscripcionId)
      if (result.success) {
        toast({
          title: "Solicitud rechazada",
          description: "La solicitud ha sido rechazada.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al rechazar la solicitud",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error de conexión",
        description: "No se pudo rechazar la solicitud. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <LoadingState message="Cargando solicitudes..." />
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetchSolicitudes} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitudes de Inscripción</CardTitle>
        <CardDescription>
          Gestiona las solicitudes de estudiantes que quieren inscribirse en tus cursos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!solicitudesPendientes || solicitudesPendientes.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No hay solicitudes pendientes"
            description="Las nuevas solicitudes de estudiantes aparecerán aquí para su revisión"
          />
        ) : (
          <div className="space-y-4">
            {solicitudesPendientes.map((solicitud) => (
              <Card key={solicitud.id} className="border-l-4 border-l-yellow-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <Badge variant="secondary">{solicitud.estado}</Badge>
                      </div>
                      <h4 className="font-semibold mb-1">{solicitud.cursoTitulo}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Solicitado por: {solicitud.estudianteNombre}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Fecha: {new Date(solicitud.fechaInscripcion).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAprobar(solicitud.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRechazar(solicitud.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}