"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/context/auth.context"
import { coursesService } from "@/lib/services/courses.service"
import type { Inscripcion } from "@/lib/types"
import { Check, X, Clock, Users } from "lucide-react"

export function SolicitudesInscripcionTab() {
  const { user } = useAuth()
  const [solicitudes, setSolicitudes] = useState<Inscripcion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [procesando, setProcesando] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadSolicitudes()
    }
  }, [user])

  const loadSolicitudes = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    const result = await coursesService.getSolicitudesPendientes(user.id)

    if (result.success && result.data) {
      setSolicitudes(result.data)
    } else {
      setError(result.error || "Error al cargar solicitudes")
    }

    setLoading(false)
  }

  const handleAprobar = async (inscripcionId: string) => {
    setProcesando(inscripcionId)

    const result = await coursesService.aprobarInscripcion(inscripcionId)

    if (result.success) {
      setSolicitudes(solicitudes.filter(s => s.id !== inscripcionId))
      alert("Solicitud aprobada exitosamente")
    } else {
      alert(result.error || "Error al aprobar solicitud")
    }

    setProcesando(null)
  }

  const handleRechazar = async (inscripcionId: string) => {
    if (!confirm("¿Estás seguro de rechazar esta solicitud?")) return

    setProcesando(inscripcionId)

    const result = await coursesService.rechazarInscripcion(inscripcionId)

    if (result.success) {
      setSolicitudes(solicitudes.filter(s => s.id !== inscripcionId))
      alert("Solicitud rechazada")
    } else {
      alert(result.error || "Error al rechazar solicitud")
    }

    setProcesando(null)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes de Inscripción</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {solicitudes.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hay solicitudes pendientes</h3>
            <p className="text-muted-foreground">
              Las nuevas solicitudes aparecerán aquí para su revisión
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {solicitudes.map((solicitud) => (
              <Card key={solicitud.id} className="border-l-4 border-l-yellow-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <Badge variant="secondary">Pendiente</Badge>
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
                        disabled={procesando === solicitud.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRechazar(solicitud.id)}
                        disabled={procesando === solicitud.id}
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