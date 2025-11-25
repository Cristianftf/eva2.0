"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/context/auth.context"
import { cuestionariosService } from "@/lib/services/cuestionarios.service"
import { Award, TrendingUp, CheckCircle2 } from "lucide-react"

interface Calificacion {
  id: string
  curso: string
  cuestionario: string
  calificacion: number
  fecha: string
  estado: string
}

export function MisCalificacionesTab() {
  const { user } = useAuth()
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadCalificaciones()
    }
  }, [user])

  const loadCalificaciones = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    const result = await cuestionariosService.getResultadosByEstudiante(user.id)

    if (result.success && result.data) {
      const formatted = result.data.map((item: any) => ({
        id: item.id.toString(),
        curso: item.curso,
        cuestionario: item.cuestionario,
        calificacion: Math.round(item.calificacion),
        fecha: item.fecha,
        estado: item.estado,
      }))
      setCalificaciones(formatted)
    } else {
      setError(result.error || "Error al cargar calificaciones")
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const promedioGeneral = calificaciones.length > 0 ? Math.round(calificaciones.reduce((acc, c) => acc + c.calificacion, 0) / calificaciones.length) : 0

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Calificaciones</CardTitle>
          <CardDescription>Tu rendimiento académico general</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Promedio General</p>
                <p className="text-2xl font-bold">{promedioGeneral}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-green-500/10 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Evaluaciones Aprobadas</p>
                <p className="text-2xl font-bold">{calificaciones.filter(c => c.estado === "aprobado").length}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Evaluaciones</p>
                <p className="text-2xl font-bold">{calificaciones.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grades List */}
      {calificaciones.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tienes calificaciones aún</h3>
            <p className="text-muted-foreground text-center">
              Completa cuestionarios en tus cursos para ver tus calificaciones aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Calificaciones</CardTitle>
            <CardDescription>Todas tus evaluaciones completadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {calificaciones.map((cal) => (
              <Card key={cal.id} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{cal.cuestionario}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{cal.curso}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(cal.fecha).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="text-3xl font-bold">{cal.calificacion}</div>
                      <Badge
                        variant={cal.calificacion >= 70 ? "default" : "destructive"}
                        className="w-full justify-center"
                      >
                        {cal.calificacion >= 70 ? "Aprobado" : "Reprobado"}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Progress value={cal.calificacion} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
