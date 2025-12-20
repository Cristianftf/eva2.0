"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useStudentData } from "@/hooks/use-student-data"
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/data-states"
import { Award, TrendingUp, CheckCircle2 } from "lucide-react"

export function MisCalificacionesTab() {
  const { resultadosCuestionarios, loading, error, refetchResultados } = useStudentData()

  // Formatear calificaciones usando useMemo
  const calificaciones = useMemo(() => {
    if (!resultadosCuestionarios) return []

    return resultadosCuestionarios.map((item: any) => ({
      id: item.id.toString(),
      curso: item.curso,
      cuestionario: item.cuestionario,
      calificacion: Math.round(item.calificacion),
      fecha: item.fecha,
      estado: item.estado,
    }))
  }, [resultadosCuestionarios])

  // Calcular estadísticas usando useMemo
  const estadisticas = useMemo(() => {
    if (!calificaciones.length) return { promedio: 0, aprobadas: 0, total: 0 }

    const promedio = Math.round(calificaciones.reduce((acc, c) => acc + c.calificacion, 0) / calificaciones.length)
    const aprobadas = calificaciones.filter(c => c.estado === "aprobado").length

    return {
      promedio,
      aprobadas,
      total: calificaciones.length
    }
  }, [calificaciones])

  if (loading) {
    return <LoadingState message="Cargando calificaciones..." />
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetchResultados} />
  }

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
                <p className="text-2xl font-bold">{estadisticas.promedio}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-green-500/10 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Evaluaciones Aprobadas</p>
                <p className="text-2xl font-bold">{estadisticas.aprobadas}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Evaluaciones</p>
                <p className="text-2xl font-bold">{estadisticas.total}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grades List */}
      {calificaciones.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No tienes calificaciones aún"
          description="Completa cuestionarios en tus cursos para ver tus calificaciones aquí"
        />
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
